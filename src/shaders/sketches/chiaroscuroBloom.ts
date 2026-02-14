/**
 * CHIAROSCURO BLOOM SKETCH
 * Quasar diagonal: dense lower-left gas collapses into a singularity and erupts brighter toward upper-right.
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
    vec2 axis = normalize(vec2(1.0, 1.0));
    vec2 perp = vec2(-axis.y, axis.x);

    // Singularity moves ONLY along the diagonal beam axis (mouse constrained to line).
    vec2 mouseDelta = uMouse - vec2(0.5);
    float axisT = dot(mouseDelta, axis);
    vec2 coreUv = vec2(0.5) + axis * axisT * 0.65;

    vec2 p = (st - coreUv) * aspect;
    float along = dot(p, axis);
    float across = dot(p, perp);
    float r = length(p) + 1e-4;

    // Larger, denser lower-left gas field (more than before).
    float sourceMask = smoothstep(0.62, -0.34, along) * smoothstep(0.92, 0.03, abs(across));
    float nebA = fbm((st + vec2(-t * 0.05, t * 0.02)) * 3.0);
    float nebB = fbm((st + vec2(-0.18 * t, -0.07 * t)).yx * 5.8 + vec2(4.0, -1.5));
    float nebC = fbm((st + vec2(-0.09 * t, 0.03 * t)) * 10.0 + vec2(2.0, 11.0));
    float nebula = smoothstep(0.28, 0.95, nebA * 0.65 + nebB * 0.5 + nebC * 0.35) * sourceMask;

    // Infall + swirl into core.
    vec2 inward = -p / r;
    vec2 swirl = vec2(-inward.y, inward.x);
    float turbulence = fbm(st * 11.5 + vec2(t * 0.27, -t * 0.21));
    vec2 flow = normalize(inward * (2.1 + 1.2 * nebula) + swirl * (0.55 + 0.75 * turbulence) + vec2(1e-4));

    // Stronger, brighter ejection to upper-right.
    float beamAxis = exp(-abs(across) * 36.0);
    float beamForward = smoothstep(-0.02, 0.92, along);
    float beamPulse = 0.52 + 0.48 * sin(along * 42.0 - t * 8.8 + turbulence * 11.0);
    float beam = beamAxis * beamForward * beamPulse;

    // Particle detail: dense around beam and explosive around the core.
    vec2 cell = floor((p + vec2(t * 0.9, -t * 0.35)) * 95.0);
    float particle = step(0.992, hash(cell + vec2(floor(t * 16.0), 0.0)));
    particle *= (exp(-abs(across) * 24.0) * smoothstep(-0.25, 1.2, along + 0.15) + exp(-r * 26.0) * 1.2);

    float core = exp(-r * 38.0);
    float shock = exp(-pow((r - 0.055) * 42.0, 2.0));

    vec2 carry = (flow * (20.0 + 36.0 * core + 12.0 * nebula) + axis * beam * 14.0) * px;
    vec3 prev = texture(uPrevState, st - carry).rgb * (0.962 - 0.15 * uDt);

    vec3 gasCol = mix(vec3(0.08, 0.04, 0.16), vec3(0.62, 0.22, 0.78), nebA) * nebula;
    vec3 coreCol = vec3(1.0, 0.98, 0.9) * core;
    vec3 shockCol = vec3(1.0, 0.64, 0.24) * shock;
    vec3 beamCol = vec3(0.78, 0.95, 1.0) * beam * 1.5;
    vec3 particleCol = vec3(1.0, 1.0, 1.0) * particle * (0.45 + 0.55 * beamPulse);

    float emptiness = 1.0 - smoothstep(0.11, 0.9, nebula + core + beam * 1.35);

    vec3 source = vec3(0.0);
    source += gasCol;
    source += coreCol;
    source += shockCol;
    source += beamCol;
    source += particleCol;
    source *= (1.0 - 0.82 * emptiness);

    float transfer = smoothstep(0.28, 0.0, distance(st, coreUv));
    float inject = 0.04 + 0.3 * nebula + 0.48 * core + 0.52 * beam + 0.26 * particle + 0.12 * transfer;

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

    float vignette = smoothstep(1.0, 0.08, distance(vUv, vec2(0.5)));
    float diagonalFlare = exp(-abs((vUv.x - 0.5) - (vUv.y - 0.5)) * 10.0);
    float flicker = 0.95 + 0.05 * sin(uTime * 7.5 + (vUv.x + vUv.y) * 48.0);

    color *= vignette;
    color += vec3(0.12, 0.16, 0.22) * diagonalFlare * flicker;
    color = pow(color, vec3(0.88));

    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`;
