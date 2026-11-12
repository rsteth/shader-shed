/**
 * SLIT BANDS
 * ==========
 * Shapes drawn as rows of vertical bars, with a spectrum on their left and right edges.
 *
 * Two passes, two jobs:
 *
 *   sim   = the SOURCE. Writes a "field" texture describing what to draw:
 *             r  ink    distance band around the shape edge (0.5 = on the edge, 1 = well inside)
 *             g  tone   brightness of the bars (1 for flat shapes, luminance for photos)
 *             b  hue    position on the spectrum (0 warm end, 0.5 white, 1 cool end)
 *   final = the RENDERER. Snaps the screen to a grid of bars and lights the cells that
 *           land inside the field. With the ASCII pass on it hands over the smooth field
 *           instead, so the same presets drive the glyphs.
 *
 * Every preset below is the same renderer with a different source: a signed-distance
 * `scene()` (ball, moon, ...), or a `shade()` that samples a texture (text, image).
 * Tunables are `#define`s with defaults, overridden per preset through `Sketch.defines`.
 *
 * Porting to R3F: `sim` is a ping-pong pass (useFBO), `final` is a shaderMaterial on a
 * fullscreen plane, `defines` maps to `material.defines`, and `textures` to `useTexture`.
 */

import type { Sketch, TextureSource } from './types';

// ---------------------------------------------------------------------------
// Simulation pass (source)
// ---------------------------------------------------------------------------

const SIM_HEADER = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform float uDt;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uMouseVelocity;
uniform float uMouseActive;
uniform float uScroll;
uniform float uScrollVelocity;

#ifndef EDGE
#define EDGE 0.06            // half-width of the distance band stored in the field (screen heights)
#endif
#ifndef TINT_WIDTH
#define TINT_WIDTH 0.09      // how far the spectrum reaches in from a left or right edge
#endif
#ifndef TRAIL
#define TRAIL 0.0            // seconds a shape lingers after it moves on; 0.0 turns feedback off
#endif
#ifndef CURSOR_RADIUS
#define CURSOR_RADIUS 0.1    // size of the blob the pointer adds to a scene
#endif

// Scene space: y runs -0.5..0.5, x runs -0.5*aspect..0.5*aspect, so circles stay round.
float gAspect;  // width / height
float gUnit;    // 1.0 on landscape screens; shrinks on portrait so shapes still fit
vec2 gMouse;    // pointer in scene space

float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

// Triangle wave, 0..1..0. A point moving along it reverses instantly at each end with
// its speed unchanged, which is exactly a perfectly elastic bounce.
float tri(float x) {
    return abs(fract(x) * 2.0 - 1.0);
}

vec2 rot(vec2 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

// Merge the pointer into a scene as one more blob. Fades out with uMouseActive.
float withCursor(float d, vec2 p) {
    float cursor = sdCircle(p - gMouse, CURSOR_RADIUS * gUnit);
    return mix(d, smoothUnion(d, cursor, 0.13 * gUnit), uMouseActive);
}

// Lit part of a moon of radius r. phase: 0 new, 0.25 first quarter, 0.5 full, 1 new again.
float sdMoon(vec2 p, float r, float phase) {
    float c = cos(phase * 2.0 * PI);                    // 1 at new, -1 at full
    vec2 q = vec2(phase < 0.5 ? p.x : -p.x, p.y);       // waxing is lit on the right
    float disc = length(q) - r;
    float a = max(abs(c) * r, 0.002);                   // the terminator is an ellipse this wide
    float terminator = (length(q / vec2(a, r)) - 1.0) * a;
    return c > 0.0
        ? max(disc, -min(terminator, q.x))              // crescent: disc minus (ellipse + dark half)
        : max(disc, min(-q.x, terminator));             // gibbous: disc within (lit half + ellipse)
}
`;

/** Appended after a preset's scene(): turns a signed distance into the field. */
const SDF_SHADE = /* glsl */ `
vec3 shade(vec2 uv, vec2 p) {
    float d = scene(p);

    // x-component of the outward normal: negative on left-facing edges, positive on right-facing.
    float e = 0.003;
    float nx = (scene(p + vec2(e, 0.0)) - scene(p - vec2(e, 0.0))) / (2.0 * e);
    float lean = sign(nx) * sqrt(min(abs(nx), 1.0));

    // 1 on the edge, falling to 0 once we are TINT_WIDTH inside the shape.
    float edge = 1.0 - clamp(-d / (TINT_WIDTH * gUnit), 0.0, 1.0);

    return vec3(
        clamp(0.5 - d / (2.0 * EDGE), 0.0, 1.0),
        sceneTone(p),
        0.5 + 0.5 * lean * edge
    );
}
`;

const DEFAULT_TONE = /* glsl */ `
float sceneTone(vec2 p) {
    return 1.0;
}
`;

const SIM_MAIN = /* glsl */ `
void main() {
    gAspect = uResolution.x / uResolution.y;
    gUnit = min(gAspect, 1.0);
    gMouse = (uMouse - 0.5) * vec2(gAspect, 1.0);
    vec2 p = (vUv - 0.5) * vec2(gAspect, 1.0);

    vec3 field = shade(vUv, p);

    // Feedback: where the shape has just been, keep its ink and let it run down
    // from 1.0 to the 0.5 cut-off over TRAIL seconds, cooling through the spectrum as it goes.
    vec4 prev = texture(uPrevState, vUv);
    if (TRAIL > 0.0) {
        float linger = prev.r - uDt * 0.5 / TRAIL;
        if (linger > field.r) {
            float age = 1.0 - clamp((linger - 0.5) * 2.0, 0.0, 1.0);
            field = vec3(linger, 1.0 - 0.45 * age, 0.5 + 0.5 * age);
        }
    }

    fragColor = vec4(field, 1.0);
}
`;

// ---------------------------------------------------------------------------
// Final pass (renderer)
// ---------------------------------------------------------------------------

const FINAL = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uOpacity;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uMouseActive;
uniform float uScrollVelocity;
uniform float uAscii;

#ifndef ROWS
#define ROWS 24.0            // horizontal bands down a landscape screen (portrait gets more, to match)
#endif
#ifndef BARS
#define BARS 18.0            // bars per row height-unit at the coarsest level
#endif
#ifndef LEVELS
#define LEVELS 3.0           // each row picks one of this many densities (x1, x2, x4, ...)
#endif
#ifndef DUTY
#define DUTY 0.42            // bar width as a fraction of its cell, at the finest level
#endif
#ifndef ROW_FILL
#define ROW_FILL 0.9         // bar height as a fraction of its row
#endif
#ifndef REROLL
#define REROLL 0.3           // how often a row picks a new density, per second
#endif
#ifndef DRIFT
#define DRIFT 0.12           // sideways creep of each row, in cells per second
#endif
#ifndef SCROLL_SHEAR
#define SCROLL_SHEAR 0.5     // cells a row is knocked sideways per viewport/second of scroll
#endif
#ifndef WARP
#define WARP 1.0             // < 1.0 packs bars toward the left edge, > 1.0 toward the right
#endif
#ifndef BACKGROUND
#define BACKGROUND vec3(0.047, 0.047, 0.059)
#endif

// 0 = red .. orange .. yellow .. 0.5 = white .. cyan .. blue .. 1 = violet
vec3 spectrum(float s) {
    float t = clamp(s, 0.0, 1.0) * 6.0;
    vec3 c = mix(vec3(1.0, 0.36, 0.40), vec3(1.0, 0.62, 0.30), clamp(t, 0.0, 1.0));
    c = mix(c, vec3(1.0, 0.92, 0.42), clamp(t - 1.0, 0.0, 1.0));
    c = mix(c, vec3(1.0), clamp(t - 2.0, 0.0, 1.0));
    c = mix(c, vec3(0.42, 0.95, 0.92), clamp(t - 3.0, 0.0, 1.0));
    c = mix(c, vec3(0.36, 0.62, 1.0), clamp(t - 4.0, 0.0, 1.0));
    c = mix(c, vec3(0.58, 0.42, 1.0), clamp(t - 5.0, 0.0, 1.0));
    return c;
}

void main() {
    vec4 here = texture(uTexture, vUv);

    // ASCII pass is on: give it the smooth field and let the glyphs do the quantising.
    if (uAscii > 0.5) {
        float ink = smoothstep(0.5, 0.6, here.r);
        fragColor = vec4(spectrum(here.b) * here.g * ink, uOpacity);
        return;
    }

    // The grid is sized against the shorter side, like the scenes, so portrait screens
    // get the same number of bars across a shape as landscape ones.
    float aspect = uResolution.x / uResolution.y;
    float unit = min(aspect, 1.0);
    float rows = max(floor(ROWS / unit), 1.0);
    float row = floor(vUv.y * rows);
    float rowY = (row + 0.5) / rows;

    // Each row re-rolls its bar density on its own clock; rows next to the pointer go one finer.
    float epoch = floor(uTime * REROLL + random(vec2(row, 3.0)) * 7.0);
    float level = floor(random(vec2(row, epoch)) * LEVELS);
    float nearPointer = step(abs(rowY - uMouse.y) * rows, 1.6) * step(0.5, uMouseActive);
    level = min(level + nearPointer, LEVELS - 1.0);
    float count = max(floor(BARS * aspect / unit), 1.0) * pow(2.0, level);

    // Rows creep sideways at their own pace and get knocked along by scroll speed.
    float jitter = random(vec2(row, 11.0)) - 0.5;
    float phase = random(vec2(row, 7.0)) + (uTime * DRIFT + uScrollVelocity * SCROLL_SHEAR) * jitter;

    float x = clamp(vUv.x, 0.0, 1.0);
    float bx = pow(x, WARP) * count + phase;
    float cell = floor(bx);
    float cellX = pow(clamp((cell + 0.5 - phase) / count, 0.0, 1.0), 1.0 / WARP);

#ifdef CONTINUOUS
    // Bars are a mask over the field: detail inside each bar survives (text, photos).
    vec4 field = here;
    float on = smoothstep(0.4, 0.6, field.r);
#else
    // One sample per bar: each bar is wholly on or off and a single flat colour.
    vec4 field = texture(uTexture, vec2(cellX, rowY));
    float on = step(0.5, field.r);
#endif

    // Antialiased bar and row masks, centred in their cell.
    // Coarser rows keep the same bar width, so they read as thin bars with wide gaps.
    float duty = DUTY * pow(2.0, level - (LEVELS - 1.0));
    float pxBar = count * WARP * pow(max(x, 0.001), WARP - 1.0) / uResolution.x;
    float bar = 1.0 - smoothstep(0.5 * duty - pxBar, 0.5 * duty, abs(bx - cell - 0.5));
    float pxRow = rows / uResolution.y;
    float band = 1.0 - smoothstep(0.5 * ROW_FILL - pxRow, 0.5 * ROW_FILL, abs(fract(vUv.y * rows) - 0.5));

    vec3 color = BACKGROUND + spectrum(field.b) * field.g * on * bar * band;
    fragColor = vec4(color, uOpacity);
}
`;

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

interface SlitPreset {
  name: string;
  description: string;
  /** GLSL defining `float scene(vec2 p)` (signed distance) and optionally `float sceneTone(vec2 p)`. */
  scene?: string;
  /** GLSL defining `vec3 shade(vec2 uv, vec2 p)` directly, for sources that are not distance fields. */
  shade?: string;
  defines?: Sketch['defines'];
  textures?: Record<string, TextureSource>;
  scrollDriven?: boolean;
}

function slitSketch(preset: SlitPreset): Sketch {
  let source: string;
  if (preset.scene !== undefined) {
    const tone = preset.scene.includes('float sceneTone(') ? '' : DEFAULT_TONE;
    source = preset.scene + tone + SDF_SHADE;
  } else {
    source = preset.shade ?? '';
  }

  return {
    name: `Slit Bands · ${preset.name}`,
    description: preset.description,
    sim: SIM_HEADER + source + SIM_MAIN,
    final: FINAL,
    defines: preset.defines,
    textures: preset.textures,
    scrollDriven: preset.scrollDriven,
    includeInSlideshow: false,
  };
}

/** Shared by the two text presets. GLITCH_SCROLL switches the driver from a timer to scroll. */
const TEXT_SHADE = /* glsl */ `
uniform sampler2D uText;
uniform vec2 uTextSize;

#ifndef SLICES
#define SLICES 40.0          // vertical strips the word is cut into
#endif

vec3 shade(vec2 uv, vec2 p) {
    // Fit the word inside the frame, keeping its aspect.
    float textAspect = uTextSize.x / uTextSize.y;
    float w = min(0.9 * gAspect, 0.34 * textAspect);
    float h = w / textAspect;
    vec2 t = p / vec2(w, h) + 0.5;

    float slice = floor(t.x * SLICES);
    float sliceX = ((slice + 0.5) / SLICES - 0.5) * w;

#ifdef GLITCH_SCROLL
    // Crisp when the block is centred in the viewport, scattered toward either end.
    float amount = smoothstep(0.1, 1.0, abs(uScroll - 0.5) * 2.0);
    amount = clamp(amount + abs(uScrollVelocity) * 0.05, 0.0, 1.0);
    float seed = 0.0;
#else
    // Every 5 seconds: a burst that re-rolls 9 times a second and settles within 1.2s.
    float cycle = uTime / 5.0;
    float burst = 1.0 - clamp(fract(cycle) / 0.24, 0.0, 1.0);
    float amount = burst * burst;
    float seed = floor(cycle) * 17.0 + floor(uTime * 9.0) * step(0.001, amount);
#endif

    // The pointer scrambles the strips under it.
    amount = max(amount, 0.7 * uMouseActive * (1.0 - smoothstep(0.0, 0.22 * gUnit, abs(sliceX - gMouse.x))));

    float lift = random(vec2(slice, seed + 1.0)) - 0.5;
    float squeeze = random(vec2(slice, seed + 2.0));
    t.y += lift * 2.4 * amount;
    t.x = (slice + 0.5 + (fract(t.x * SLICES) - 0.5) * mix(1.0, 0.2 + 1.6 * squeeze, amount)) / SLICES;

    float inside = step(0.0, t.x) * step(t.x, 1.0) * step(0.0, t.y) * step(t.y, 1.0);
    float ink = texture(uText, t).r * inside;

    // Warm on the first letters, cool on the last, and displaced strips pick up colour.
    float hue = 0.5 - 0.5 * (1.0 - smoothstep(0.0, 0.16, t.x)) + 0.5 * smoothstep(0.84, 1.0, t.x);
    hue = clamp(hue + lift * 1.4 * amount, 0.0, 1.0);

    return vec3(ink, 1.0, hue);
}
`;

const TEXT_DEFINES = { CONTINUOUS: true, ROWS: 12, BARS: 44, LEVELS: 1, ROW_FILL: 1, DUTY: 0.66, DRIFT: 0.35 } as const;

const presets: Record<string, SlitPreset> = {
  slitBall: {
    name: 'Bouncing Ball',
    description: 'A ball that rebounds off every edge and never slows down, trailing bars behind it',
    defines: { TRAIL: 0.7 },
    scene: /* glsl */ `
float scene(vec2 p) {
    float r = 0.17 * gUnit;
    vec2 reach = vec2(0.5 * gAspect, 0.5) - r;
    // Two triangle waves with unrelated periods: straight runs, perfect rebounds, no energy lost.
    vec2 pos = (vec2(tri(uTime * 0.11 + 0.17), tri(uTime * 0.173 + 0.61)) * 2.0 - 1.0) * reach;
    return withCursor(sdCircle(p - pos, r), p);
}
`,
  },

  slitMoon: {
    name: 'Moon',
    description: 'A tilted moon that runs through its phases, with maria shading the bars',
    scene: /* glsl */ `
vec2 moonSpace(vec2 p) {
    vec2 centre = vec2(0.03 * sin(uTime * 0.21), 0.02 * sin(uTime * 0.17));
    return rot(p - centre, 0.4);
}

float scene(vec2 p) {
    // 26 second lunation, skipping the slivers either side of new that are too thin to hold a bar.
    float phase = 0.1 + 0.8 * fract(uTime / 26.0 + 0.2);
    return withCursor(sdMoon(moonSpace(p), 0.31 * gUnit, phase), p);
}

float sceneTone(vec2 p) {
    return 0.6 + 0.4 * smoothstep(0.38, 0.62, fbm(moonSpace(p) * 7.0 / gUnit + 3.0));
}
`,
  },

  slitTransit: {
    name: 'Transit',
    description: 'A small moon orbiting a planet, crossing in front of it and passing behind',
    scene: /* glsl */ `
float scene(vec2 p) {
    float a = uTime * 0.55;
    float gap = 0.022 * gUnit;
    float planet = sdCircle(p, 0.24 * gUnit);
    float moon = sdCircle(p - vec2(cos(a) * 0.52, -sin(a) * 0.08) * gUnit, 0.07 * gUnit);

    // Near half of the orbit: the moon cuts a ring-shaped gap out of the planet.
    // Far half: the planet cuts the gap out of the moon.
    float d = sin(a) > 0.0
        ? min(max(planet, -(moon - gap)), moon)
        : min(planet, max(moon, -(planet - gap)));
    return withCursor(d, p);
}
`,
  },

  slitRibbon: {
    name: 'Ribbon',
    description: 'A travelling wave that bends toward the pointer',
    scene: /* glsl */ `
float scene(vec2 p) {
    float y = 0.15 * sin(p.x * 4.2 - uTime * 0.9) + 0.05 * sin(p.x * 9.0 + uTime * 1.3);
    float pull = uMouseActive * exp(-pow((p.x - gMouse.x) / (0.22 * gUnit), 2.0));
    y = mix(y, gMouse.y, 0.85 * pull);
    float ribbon = (abs(p.y - y) - 0.09) * 0.8;
    return max(ribbon, abs(p.x) - (0.5 * gAspect - 0.08));
}
`,
  },

  slitLava: {
    name: 'Lava',
    description: 'Four blobs that merge and split; the pointer is a fifth',
    scene: /* glsl */ `
float scene(vec2 p) {
    float d = 1e5;
    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        vec2 centre = vec2(
            sin(uTime * (0.31 + fi * 0.07) + fi * 2.1) * 0.34 * gAspect,
            cos(uTime * (0.23 + fi * 0.05) + fi * 1.3) * 0.3
        );
        d = smoothUnion(d, sdCircle(p - centre, (0.11 + 0.025 * fi) * gUnit), 0.21 * gUnit);
    }
    return withCursor(d, p);
}
`,
  },

  slitSonar: {
    name: 'Sonar',
    description: 'Rings spreading from the centre, or from the pointer while it is on the canvas',
    defines: { ROWS: 30, BARS: 22, TINT_WIDTH: 0.05 },
    scene: /* glsl */ `
float ringRadius(vec2 p) {
    return length(p - gMouse * uMouseActive);
}

float scene(vec2 p) {
    float period = 0.26 * gUnit;
    return abs(mod(ringRadius(p) - uTime * 0.07, period) - 0.5 * period) - 0.05 * gUnit;
}

float sceneTone(vec2 p) {
    return 1.0 - 0.75 * smoothstep(0.15, 0.75, ringRadius(p));
}
`,
  },

  slitCursor: {
    name: 'Cursor Brush',
    description: 'Paint with the pointer: the blob stretches with speed and leaves a cooling trail',
    defines: { TRAIL: 1.6 },
    scene: /* glsl */ `
float scene(vec2 p) {
    // With no pointer on the canvas (touch screens, idle pages) a slow figure-eight stands in.
    vec2 idle = vec2(sin(uTime * 0.7) * 0.32 * gAspect, sin(uTime * 1.4) * 0.24);
    vec2 centre = mix(idle, gMouse, uMouseActive);

    vec2 velocity = uMouseVelocity * vec2(gAspect, 1.0) * uMouseActive;
    float speed = length(velocity);
    vec2 dir = speed > 0.001 ? velocity / speed : vec2(1.0, 0.0);

    vec2 q = p - centre;
    float stretch = 1.0 + min(speed * 0.6, 1.6);
    vec2 local = vec2(dot(q, dir) / stretch, dot(q, vec2(-dir.y, dir.x)));
    return length(local) - 0.13 * gUnit;
}
`,
  },

  slitText: {
    name: 'Headline',
    description: 'A word from a text texture, cut into strips that scatter and settle',
    textures: { uText: { kind: 'text', text: 'SHADER SHED' } },
    defines: TEXT_DEFINES,
    shade: TEXT_SHADE,
  },

  slitImage: {
    name: 'Blinds',
    description: 'An image texture seen through drifting vertical slits',
    textures: { uImage: { kind: 'image', src: '/textures/still-life.svg' } },
    defines: { CONTINUOUS: true, ROWS: 1, LEVELS: 1, ROW_FILL: 1, BARS: 34, DUTY: 0.45, WARP: 0.6, DRIFT: 0.8 },
    shade: /* glsl */ `
uniform sampler2D uImage;
uniform vec2 uImageSize;

vec3 shade(vec2 uv, vec2 p) {
    // Cover-fit the image, then let it slide a little with time and the pointer.
    float imageAspect = uImageSize.x / uImageSize.y;
    vec2 t = uv - 0.5;
    if (gAspect > imageAspect) {
        t.y *= imageAspect / gAspect;
    } else {
        t.x *= gAspect / imageAspect;
    }
    t.x += 0.025 * sin(uTime * 0.3) + 0.05 * (uMouse.x - 0.5) * uMouseActive;

    vec3 rgb = texture(uImage, t * 0.92 + 0.5).rgb;
    float luminance = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
    return vec3(1.0, luminance, 0.5);
}
`,
  },

  slitScrollMoon: {
    name: 'Scroll · Moon Phase',
    description: 'Scroll progress waxes a rising moon from a thin crescent to full',
    scrollDriven: true,
    scene: /* glsl */ `
float scene(vec2 p) {
    float phase = mix(0.18, 0.5, smoothstep(0.0, 0.92, uScroll));
    vec2 centre = vec2(0.0, mix(-0.14, 0.05, uScroll));
    return sdMoon(rot(p - centre, 0.4), 0.3 * gUnit, phase);
}
`,
  },

  slitScrollMorph: {
    name: 'Scroll · Morph',
    description: 'Scroll progress turns a disc into a ribbon, then floods the frame with bars',
    scrollDriven: true,
    scene: /* glsl */ `
float scene(vec2 p) {
    float disc = sdCircle(p, 0.24 * gUnit);
    float ribbon = (abs(p.y - 0.14 * sin(p.x * 4.5 + uScroll * 6.0)) - 0.09) * 0.8;
    ribbon = max(ribbon, abs(p.x) - (0.5 * gAspect - 0.08));

    float d = mix(disc, ribbon, smoothstep(0.12, 0.5, uScroll));
    return d - 0.6 * clamp((uScroll - 0.72) / 0.28, 0.0, 1.0);
}
`,
  },

  slitScrollText: {
    name: 'Scroll · Headline',
    description: 'A scattered word that assembles as its block reaches the middle of the viewport',
    scrollDriven: true,
    textures: { uText: { kind: 'text', text: 'SCROLL' } },
    defines: { ...TEXT_DEFINES, GLITCH_SCROLL: true, SLICES: 28 },
    shade: TEXT_SHADE,
  },
};

export const slitBandSketches: Record<string, Sketch> = Object.fromEntries(
  Object.entries(presets).map(([id, preset]) => [id, slitSketch(preset)])
);

export const slitBandIds = Object.keys(slitBandSketches);
