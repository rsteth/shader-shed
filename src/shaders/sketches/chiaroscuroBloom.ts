/**
 * CHIAROSCURO BLOOM SKETCH
 * Quasar diagonal: nebula from lower-left collapses into a singularity, then blasts toward upper-right.
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
    vec2 st = vUv;
    vec2 px = 1.0 / uResolution;
    float t = uTime;

    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);

    // Singular core near center, slightly mouse-steerable
    vec2 coreUv = vec2(0.5) + (uMouse - 0.5) * vec2(0.08, 0.08);
    vec2 p = (st - coreUv) * aspect;

    // Main diagonal axis: lower-left -> upper-right
    vec2 axis = normalize(vec2(1.0, 1.0));
    vec2 perp = vec2(-axis.y, axis.x);

    float along = dot(p, axis);
    float across = dot(p, perp);
    float r = length(p) + 1e-4;

    // Nebula source region biased to lower-left half-ish
    float sourceMask = smoothstep(0.38, -0.28, along) * smoothstep(0.58, 0.04, abs(across));

    float nebA = fbm((st + vec2(-t * 0.03, t * 0.01)) * 4.2);
    float nebB = fbm((st + vec2(-0.14 * t, -0.04 * t)).yx * 7.2 + vec2(6.0, -2.0));
    float nebula = smoothstep(0.35, 0.92, nebA * 0.65 + nebB * 0.55) * sourceMask;

    // Infall dynamics: mostly toward center with swirl and turbulence
    vec2 inward = -p / r;
    vec2 swirl = vec2(-inward.y, inward.x);
    float turbulence = fbm(st * 10.0 + vec2(t * 0.2, -t * 0.17));
    vec2 flow = normalize(inward * (1.8 + 0.9 * nebula) + swirl * (0.45 + 0.6 * turbulence) + vec2(1e-4));

    // Beam/jet toward upper-right after the chokepoint
    float beamAxis = exp(-abs(across) * 28.0);
    float beamForward = smoothstep(-0.04, 0.52, along);
    float beamPulse = 0.45 + 0.55 * sin(along * 36.0 - t * 7.5 + turbulence * 9.0);
    float beam = beamAxis * beamForward * beamPulse;

    // Dense particle spark detail around axis/core
    vec2 cell = floor((p + vec2(t * 0.7, -t * 0.3)) * 85.0);
    float particle = step(0.994, hash(cell + vec2(floor(t * 12.0), 0.0)));
    particle *= exp(-abs(across) * 22.0) * smoothstep(-0.2, 0.9, along + 0.15);

    float core = exp(-r * 34.0);
    float shock = exp(-pow((r - 0.06) * 35.0, 2.0));

    // Advection carries source through collapse and outflow
    vec2 carry = (flow * (18.0 + 28.0 * core + 8.0 * nebula) + axis * beam * 11.0) * px;
    vec3 prev = texture(uPrevState, st - carry).rgb * (0.963 - 0.16 * uDt);

    // Compose emission
    vec3 gasCol = mix(vec3(0.06, 0.04, 0.14), vec3(0.45, 0.2, 0.66), nebA) * nebula;
    vec3 coreCol = vec3(1.0, 0.96, 0.84) * core;
    vec3 shockCol = vec3(1.0, 0.58, 0.2) * shock;
    vec3 beamCol = vec3(0.55, 0.86, 1.0) * beam;
    vec3 particleCol = vec3(0.95, 0.98, 1.0) * particle * (0.5 + 0.5 * beamPulse);

    float emptiness = 1.0 - smoothstep(0.16, 0.78, nebula + beam + core);

    vec3 source = vec3(0.0);
    source += gasCol;
    source += coreCol;
    source += shockCol;
    source += beamCol;
    source += particleCol;
    source *= (1.0 - 0.9 * emptiness);

    float transfer = smoothstep(0.24, 0.0, distance(st, uMouse));
    float inject = 0.03 + 0.22 * nebula + 0.4 * core + 0.32 * beam + 0.2 * particle + 0.08 * transfer;

    vec3 color = mix(prev, source, clamp(inject, 0.0, 1.0));
    fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

export const final = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uOpacity;

void main() {
    vec3 color = texture(uTexture, vUv).rgb;

    float vignette = smoothstep(1.0, 0.1, distance(vUv, vec2(0.5)));
    float diagonalFlare = exp(-abs((vUv.x - 0.5) - (vUv.y - 0.5)) * 12.0);
    float flicker = 0.96 + 0.04 * sin(uTime * 6.0 + (vUv.x + vUv.y) * 40.0);

    color *= vignette;
    color += vec3(0.08, 0.12, 0.2) * diagonalFlare * flicker;
    color = pow(color, vec3(0.9));

    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`;
