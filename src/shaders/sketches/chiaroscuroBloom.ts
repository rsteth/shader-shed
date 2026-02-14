/**
 * CHIAROSCURO BLOOM SKETCH
 * Quasar diagonal: dense lower-left gas pinches into a singularity and erupts brighter toward upper-right.
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

    // Singularity moves only on the diagonal rail.
    vec2 mouseDelta = uMouse - vec2(0.5);
    float axisT = dot(mouseDelta, axis);
    vec2 coreUv = vec2(0.5) + axis * axisT * 0.65;

    vec2 p = (st - coreUv) * aspect;
    float along = dot(p, axis);
    float across = dot(p, perp);
    float r = length(p) + 1e-4;

    // Stretch domain along direction of travel so the current reads beam-aligned.
    vec2 stretchedP = vec2(along * 0.28, across * 3.2);

    // Pinch profile strongest upstream near lower-left of the core.
    float upstream = smoothstep(0.74, -0.1, along);
    float pinch = exp(-r * 7.8) * upstream;

    // Compress across-axis coordinate to funnel gas into singularity.
    vec2 pinchedP = vec2(along, across * (1.0 - 0.9 * pinch));
    vec2 pinched = axis * pinchedP.x + perp * pinchedP.y;
    vec2 pinchUv = coreUv + pinched / aspect;

    // Dense lower-left purple gas reservoir.
    float coneWidth = mix(1.6, 0.08, smoothstep(-1.4, 0.2, along));
    float sourceMask = smoothstep(1.05, -0.55, along) * smoothstep(coneWidth, 0.015, abs(pinchedP.y));
    float nebA = fbm((pinchUv + vec2(-t * 0.06, t * 0.02)) * 2.8);
    float nebB = fbm((pinchUv + vec2(-0.22 * t, -0.08 * t)).yx * 5.4 + vec2(4.0, -1.5));
    float nebC = fbm((pinchUv + vec2(-0.1 * t, 0.03 * t)) * 10.0 + vec2(2.0, 11.0));
    float nebula = smoothstep(0.24, 0.95, nebA * 0.7 + nebB * 0.52 + nebC * 0.35) * sourceMask;

    // Furnace-inspired stepped teeth, sampled in stretched coordinates for beam alignment.
    float q1 = round((stretchedP.x + 0.6 * stretchedP.y + t * 0.35) * 34.0);
    float q2 = round(stretchedP.y * 190.0);
    float toothField = sin(q1 * 0.22 + q2 * 0.06 - t * 6.8) + 0.5 * sin(q1 * 0.11 - t * 4.3);
    float teeth = max(toothField, 0.0) * exp(-abs(stretchedP.y) * 38.0) * smoothstep(-0.1, 1.9, along) * upstream;

    // Beam-aligned current: dominant axis flow, minimal crosswise drift.
    vec2 inwardAxis = -axis * sign(along) * smoothstep(1.8, 0.0, abs(along));
    vec2 pinchNarrow = -perp * sign(across) * pinch * 1.0;
    float turbulence = fbm(st * 11.5 + vec2(t * 0.27, -t * 0.21));
    vec2 flow = normalize(
        axis * (2.8 + 2.0 * nebula + 1.6 * teeth)
        + inwardAxis * (1.2 + 0.9 * nebula)
        + pinchNarrow
        + vec2(0.03, -0.03) * (turbulence - 0.5)
        + vec2(1e-4)
    );

    // Bright top-right beam with elongated energy teeth.
    float beamAxis = exp(-abs(stretchedP.y) * 92.0);
    float beamForward = smoothstep(-0.08, 2.3, along);
    float beamPulse = 0.55 + 0.45 * sin(along * 39.0 - t * 8.6 + turbulence * 9.0 + teeth * 2.7);
    float beam = beamAxis * beamForward * beamPulse * (1.0 + 0.4 * teeth);

    // Particle detail elongated along travel direction.
    vec2 cell = floor((vec2(stretchedP.x * 0.42, stretchedP.y * 1.9) + vec2(t * 0.95, -t * 0.35)) * 170.0);
    float particle = step(0.991, hash(cell + vec2(floor(t * 17.0), 0.0)));
    particle *= (exp(-abs(stretchedP.y) * 50.0) * smoothstep(-0.24, 2.6, along + 0.15) + exp(-r * 30.0) * 0.9);
    particle += teeth * 0.32;

    float core = exp(-r * 42.0);
    float shock = exp(-pow((r - 0.05) * 46.0, 2.0));

    vec2 carry = (flow * (28.0 + 46.0 * core + 20.0 * nebula + 16.0 * teeth)) * px;
    vec3 prev = texture(uPrevState, st - carry).rgb * (0.962 - 0.15 * uDt);

    vec3 gasCol = mix(vec3(0.08, 0.04, 0.16), vec3(0.64, 0.24, 0.8), nebA) * nebula;
    vec3 coreCol = vec3(1.0, 0.98, 0.9) * core;
    vec3 shockCol = vec3(1.0, 0.66, 0.26) * shock;
    vec3 beamCol = vec3(0.9, 0.99, 1.0) * beam * 2.1;
    vec3 toothCol = vec3(1.0, 0.85, 0.45) * teeth * (0.6 + 0.4 * beamPulse);
    vec3 particleCol = vec3(1.0, 1.0, 1.0) * particle * (0.45 + 0.55 * beamPulse);

    float emptiness = 1.0 - smoothstep(0.06, 0.98, nebula + core + beam * 2.3 + teeth * 0.85);

    vec3 source = vec3(0.0);
    source += gasCol;
    source += coreCol;
    source += shockCol;
    source += beamCol;
    source += toothCol;
    source += particleCol;
    source *= (1.0 - 0.8 * emptiness);

    float transfer = smoothstep(0.28, 0.0, distance(st, coreUv));
    float inject = 0.04 + 0.26 * nebula + 0.5 * core + 0.78 * beam + 0.34 * teeth + 0.38 * particle + 0.1 * transfer;

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
