# Shader Shed

A collection of fullscreen fragment-shader sketches with a small multipass runtime: a feedback
(ping-pong) simulation pass, a final pass, and an optional ASCII pass. Sketches can read time,
the pointer, scroll position and textures.

- **App**: Next.js 16 (App Router, static export), React 18, Tailwind 3
- **Graphics**: [regl](https://github.com/regl-project/regl) 2.1 on WebGL2, with a WebGL1 fallback
- **Math in the About panels**: KaTeX

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
npm run lint
```

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Sketch selector, ASCII toggle and About panel over a fullscreen canvas. About shows the idea and the step names, and links into the walkthrough |
| `/sketches/<id>/` | The walkthrough for one sketch: the shader fixed behind the page, its explanation scrolling over it card by card. One page is generated per registry entry |
| `/scroll/` | A tall page for trying scroll-driven sketches, as a page background and as a block in the flow. `?sketch=<id>` preselects the background |
| `/slideshow/` | Cycles every 15 s through sketches that do not set `includeInSlideshow: false` |
| `/slideshow-ascii/` | The same slideshow with the ASCII pass on |

## Project structure

```
src/
  app/
    page.tsx                 Home: selector, ASCII toggle, About panel
    sketches/[id]/page.tsx   Per-sketch walkthrough
    scroll/page.tsx          Scroll demo
    slideshow*/page.tsx      Slideshows
    sketchAbout.ts           The maths behind each sketch, keyed by sketch id
  components/
    ShaderCanvas.tsx         React wrapper: canvas, resize, pointer, scroll, render loop
    SlideshowCanvas.tsx      Timer that swaps the active sketch
    SketchWalkthrough.tsx    The scrolling explanation on /sketches/<id>/: reveal-on-scroll cards, progress bar
    SketchAboutPanel.tsx     The short version in the home page's About panel
    MathText.tsx             Renders $inline$ and $$block$$ KaTeX
  lib/regl/
    pipeline.ts              MultipassSystem: compiles a sketch, runs the passes
    uniforms.ts              UniformManager: time, pointer, scroll state
    textures.ts              Builds a sketch's texture inputs (image, text, canvas)
    render-target.ts         Picks the best float/half-float/8-bit render target the device supports
  shaders/
    common.glsl              Prepended to every sketch shader: #version, precision, PI, random, noise, fbm, smoothUnion
    frame.vert               Fullscreen quad
    asciiPost.frag           ASCII pass
    sketches/
      index.ts               The registry
      types.ts               The Sketch contract
      slitBands.ts           One renderer, twelve presets (see below)
      *.ts                   One file per sketch
public/
  textures/                  Images used by sketches
design/                      Local design-catalog tooling (see "Design catalog")
```

Not used by the app, left over from earlier versions: `src/shaders/sim.frag`,
`src/shaders/final.frag`, `src/lib/regl/context.ts`, `src/lib/regl/render-target-example.ts`
and `openapi.json`.

## How a frame is rendered

1. **sim** draws into one of two offscreen buffers and can read the other one, which holds its
   own previous frame, as `uPrevState`. The two swap every frame. This is what makes trails,
   fluids and other feedback effects possible.
2. **final** reads the buffer sim just wrote as `uTexture` and draws to the screen.
3. With ASCII on, final draws to a third buffer instead and `asciiPost.frag` turns that into glyphs.

The offscreen buffers are half-float where the device allows it, then float, then 8-bit.
`render-target.ts` logs the choice to the console on start-up.

## Writing a sketch

A sketch is plain data, defined in `src/shaders/sketches/types.ts`:

```ts
interface Sketch {
  name: string;
  description: string;
  sim: string;                    // GLSL, simulation pass
  final: string;                  // GLSL, final pass
  defines?: Record<string, string | number | boolean>;
  textures?: Record<string, TextureSource>;
  scrollDriven?: boolean;
  includeInSlideshow?: boolean;
  meta?: { attribution?: string };
}
```

1. Create `src/shaders/sketches/mySketch.ts` exporting `sim` and `final` strings.
   `gradient.ts` is a good minimal file to copy.
2. Import it in `src/shaders/sketches/index.ts` and add an entry to `sketches`.
3. Add an explanation in `src/app/sketchAbout.ts` (see "Explaining a sketch"). Without one the
   About panel shows only the sketch's description.

The sketch then appears in the selector and gets a `/sketches/<id>/` page.

### Explaining a sketch

Each sketch has a walkthrough at `/sketches/<id>/` that explains the maths behind it one step at
a time, and a short version in the home page's About panel. Both come from one entry in
`src/app/sketchAbout.ts`, which has four parts:

```ts
const mySketch: SketchAbout = {
  idea: 'One or two plain sentences: what is this?',
  steps: [
    {
      title: 'A wind made of noise',
      text: 'What this step does and why it produces what you see.',
      math: tex`\mathbf{f}=2\,\operatorname{fbm}(3\mathbf{x}+0.1t)-1`,   // optional, one equation
    },
  ],
  tryThis: [tex`$0.99$: how long trails last.`],
  uses: ['x', 't', 'fbm'],   // shared symbols to list under "Symbols"
};
```

- Steps follow the order the shader runs in, one idea and at most one equation each.
- Every constant must match the shader. Change one, change the other.
- Keep each equation under about 300 px wide at the card's font size, so it fits a phone.
  Split long ones over lines with `\begin{aligned}`.
- Use the shared symbols (`x` for position, `m` for the pointer, `S` and `S'` for the previous
  and current frame) rather than uniform names. They are defined once at the top of the file.
- `more` holds steps shared by a family of sketches. They follow the sketch's own steps under
  their own heading, so each sketch leads with what is particular to it. The Slit Bands presets
  use it for the bar renderer.

### Shader conventions

- `common.glsl` is prepended to both shaders, followed by the sketch's `defines`.
  Do not write your own `#version` or `precision` line.
- Write GLSL ES 3.00: `in vec2 vUv;`, `out vec4 fragColor;`, `texture()`.
- On WebGL1 the pipeline rewrites exactly those constructs to GLSL ES 1.00. Anything else
  that only exists in 3.00 will fail there: integer and bitwise operators, `texelFetch`,
  `round`, loops with non-constant bounds, derivatives.
- `vUv` runs 0..1 with the origin at the bottom-left.
- `common.glsl` supplies `random(vec2)`, `noise(vec2)`, `fbm(vec2)` and
  `smoothUnion(float, float, float)`. They were written for this project and contain no
  third-party code. `random` is meant for grid points (cell ids, pixel coordinates); the comments
  in the file say why.

### Inputs

Both shaders may declare any of these. A uniform you do not declare costs nothing.

| Uniform | Type | Meaning |
| --- | --- | --- |
| `uTime` | `float` | Seconds since the canvas started |
| `uDt` | `float` | Seconds since the last frame, capped at 0.1 |
| `uResolution` | `vec2` | Drawing buffer size in pixels |
| `uMouse` | `vec2` | Pointer position, 0..1, origin bottom-left. Mouse, pen and touch |
| `uMouseVelocity` | `vec2` | Smoothed pointer velocity in uv units per second |
| `uMouseActive` | `float` | Eases to 1 while a pointer is over the canvas, back to 0 when it leaves |
| `uScroll` | `float` | Scroll progress, 0..1 (see "Scroll") |
| `uScrollVelocity` | `float` | Smoothed scroll speed in viewport heights per second, positive when scrolling down |
| `uAscii` | `float` | 1 when the ASCII pass is on, else 0 |
| `<name>`, `<name>Size` | `sampler2D`, `vec2` | Each entry in the sketch's `textures` |

Pass-specific:

| Uniform | Pass | Meaning |
| --- | --- | --- |
| `uPrevState` | sim | The sim pass' own output from the previous frame |
| `uTexture` | final | The sim pass' output from this frame |
| `uOpacity` | final | Output alpha, 1 by default |

### Texture inputs

`textures` maps a sampler uniform name to a source:

```ts
textures: {
  uPhoto: { kind: 'image', src: '/textures/still-life.svg' },
  uWord:  { kind: 'text', text: 'HELLO', font: '700 Inter, sans-serif' },
  uNoise: { kind: 'canvas', width: 256, height: 256, draw: (ctx, w, h) => { /* 2D canvas API */ } },
}
```

```glsl
uniform sampler2D uPhoto;
uniform vec2 uPhotoSize;   // pixels; (1, 1) until the image has loaded
```

- **image**: any URL. Root-relative paths are prefixed with the deploy base path, so files in
  `public/` work on GitHub Pages previews. Until it loads, and if it fails to load, the sampler
  is a single black pixel.
- **text**: one line, white on black, 2048 px wide by default and as tall as the line needs.
- **canvas**: whatever the draw function paints.

All three accept `filter: 'linear' | 'nearest'` and `wrap: 'clamp' | 'repeat'`. Textures are
flipped to match `vUv`. On WebGL1, `repeat` needs power-of-two dimensions.

### Defines and presets

`defines` are written as `#define KEY VALUE` ahead of both shaders. Numbers become floats
(`ROWS: 18` is `#define ROWS 18.0`), `true` becomes a bare `#define KEY`, `false` is dropped.
Give tunables a default in the shader with `#ifndef`, and several registry entries can share
one pair of shaders with different settings. `slitBands.ts` is built this way.

## Scroll

`uScroll` and `uScrollVelocity` are fed by `<ShaderCanvas>`. Its `scrollSource` prop decides
what progress means:

| `scrollSource` | `uScroll` is | Default for |
| --- | --- | --- |
| `'page'` | Progress through the whole document: 0 at the top, 1 at the bottom | `background`, `overlay` |
| `'element'` | The canvas' trip through the viewport: 0 as its top enters at the bottom, 0.5 when centred, 1 as its bottom leaves at the top | `contained` |
| `'autoplay'` | No scrolling: eases 0 to 1 and back on a 16 s loop | - |

Set `scrollDriven: true` on a sketch that needs scroll to do anything. The home page cannot
scroll, so it plays those sketches with `'autoplay'` and links to `/scroll/`.

Pages scroll by default. The fullscreen pages (home and the slideshows) clip themselves with
`h-[100dvh] overflow-hidden` on their `<main>`.

The walkthrough pages scroll too, so a scroll-driven sketch moves as its explanation is read.

## Using the canvas

```tsx
<ShaderCanvas mode="background" sketch="slitMoon" />
```

| Prop | Values | Notes |
| --- | --- | --- |
| `mode` | `'contained'` (default), `'background'`, `'overlay'` | `contained` fills its parent. The other two are fixed to the viewport, behind or in front of the page, and track the pointer across the whole window |
| `sketch` | registry id | Changing it recompiles and clears the buffers |
| `asciiMode` | boolean | Turns the ASCII pass on |
| `scrollSource` | see above | |
| `onLoaded` | callback | Fires once the renderer is running |

Each `<ShaderCanvas>` owns a WebGL context. Browsers cap those at roughly 8 to 16 per page.

## ASCII pass

`asciiPost.frag` splits the screen into 10x16 px cells, takes the colour at each cell's centre
and draws a glyph whose density matches its brightness, in that colour. It runs after `final`
for any sketch.

A sketch whose normal output would not survive that (thin lines, hard patterns) can branch on
`uAscii` in `final` and output something smoother. Slit Bands does this: with ASCII on it skips
the bars and passes the shape itself through.

## Slit Bands

`src/shaders/sketches/slitBands.ts` draws shapes as rows of thin vertical bars with a spectrum
on their left and right edges. It is one renderer with interchangeable sources:

- **sim** writes a *field*: red is a band of distance around the shape's edge (0.5 is exactly on
  the edge), green is brightness, blue is a position on the spectrum.
- **final** snaps the screen to a grid of bars and lights the ones whose centre is inside.

| Id | Source | Reacts to |
| --- | --- | --- |
| `slitBall` | A ball rebounding off every edge at constant speed, with a trail | Pointer |
| `slitMoon` | A moon running through its phases | Pointer |
| `slitTransit` | A small moon orbiting a planet | Pointer |
| `slitRibbon` | A travelling wave | Pointer bends it |
| `slitLava` | Four merging blobs | Pointer is a fifth |
| `slitSonar` | Expanding rings | Pointer moves the centre |
| `slitCursor` | A brush that follows the pointer and leaves a trail | Pointer, pointer speed |
| `slitText` | A text texture cut into strips that scatter and settle | Pointer scrambles strips |
| `slitImage` | An image texture behind drifting slits | Pointer |
| `slitScrollMoon` | Moon phase and height follow `uScroll` | Scroll |
| `slitScrollMorph` | Disc, then ribbon, then a full frame of bars | Scroll |
| `slitScrollText` | A word that assembles when its block is centred in the viewport | Scroll, pointer |

In every preset the rows next to the pointer switch to a finer bar density, and scroll speed
knocks rows sideways.

To add a preset, add an entry to `presets` in that file with either a `scene` (GLSL defining
`float scene(vec2 p)`, a signed distance) or a `shade` (GLSL defining
`vec3 shade(vec2 uv, vec2 p)`, for texture sources). The tunables and their defaults are the
`#ifndef` blocks at the top of each shader string.

`public/textures/still-life.svg` is a placeholder for `slitImage`. Replace it with any image.

## Porting a sketch to React Three Fiber

Sketch files have no dependency on regl, React or Next, so they copy over as they are.

| Shader Shed | React Three Fiber |
| --- | --- |
| `ShaderCanvas.tsx` | `<Canvas>` |
| `pipeline.ts` | `useFrame` plus two `useFBO` targets swapped each frame |
| `sim` | `shaderMaterial` on a fullscreen plane, rendered into the FBO |
| `final` | `shaderMaterial` on a fullscreen plane, rendered to the screen |
| `common.glsl` + `defines` | Prepend `common.glsl` (minus `#version` and `precision`, which three.js adds); pass `defines` to the material |
| `textures` | `useTexture` for images, `CanvasTexture` for text and canvas; set the `<name>Size` uniform yourself |
| `uniforms.ts` | A ref or store updated in `useFrame`; pointer from `useThree`, scroll from drei's `useScroll` or `window` |
| `frame.vert` | Any vertex shader that passes `uv` through as `vUv` |

With `glslVersion: THREE.GLSL3` on the material the fragment shaders are meant to compile
unchanged. That port has not been run from this repo yet.

## Design catalog

`design/` holds a local, read-only catalog of the app for the design-system workbench: fixtures,
an inventory, and SHA-256 hashes of the source files it was reviewed against
(`design/source-hashes.json`). `node design/check.mjs` fails when those files change, which
means the catalog needs reviewing again. See `design/README.md`.

## GitHub Pages

`.github/workflows/pages.yml` builds the static export on every push and publishes it to the
`gh-pages` branch.

- `main` deploys to `https://<owner>.github.io/<repo>/`
- Any other branch deploys to `https://<owner>.github.io/<repo>/previews/<slug>/`, where
  `<slug>` is the branch name lowercased with `/` replaced by `-`, followed by `-` and the first
  8 hex characters of the branch name's SHA-256
- Deleting a branch removes its preview
- Each deployment includes a `preview-info.json` with the branch name and URL

Setup: in the repository's Pages settings choose "Deploy from a branch", `gh-pages`, `/ (root)`.
On the GitHub Free plan the repository must be public.

The build receives the deploy path as `BASE_PATH`. `next.config.mjs` uses it for `basePath` and
exposes it to client code as `NEXT_PUBLIC_BASE_PATH`, which is how texture URLs are resolved.

## License

MIT. See [LICENSE](LICENSE).
