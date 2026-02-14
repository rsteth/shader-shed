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

    // Pinch profile: strongest upstream near lower-left side of the core.
    float upstream = smoothstep(0.72, -0.08, along);
    float pinch = exp(-r * 7.5) * upstream;

    // Compress across-axis coordinate to visibly funnel gas into singularity.
    vec2 pinchedP = vec2(along, across * (1.0 - 0.88 * pinch));
    vec2 pinched = axis * pinchedP.x + perp * pinchedP.y;
    vec2 pinchUv = coreUv + pinched / aspect;

    // Larger, denser lower-left purple gas.
    float sourceMask = smoothstep(0.7, -0.4, along) * smoothstep(0.95, 0.02, abs(pinchedP.y));
    float nebA = fbm((pinchUv + vec2(-t * 0.06, t * 0.02)) * 3.0);
    float nebB = fbm((pinchUv + vec2(-0.2 * t, -0.08 * t)).yx * 5.9 + vec2(4.0, -1.5));
    float nebC = fbm((pinchUv + vec2(-0.1 * t, 0.03 * t)) * 10.5 + vec2(2.0, 11.0));
    float nebula = smoothstep(0.26, 0.95, nebA * 0.68 + nebB * 0.52 + nebC * 0.35) * sourceMask;

    // "Teeth" adapted from Furnace Mire style stepped harmonics.
    float q1 = round((pinchUv.x + pinchUv.y + t * 0.35) * 32.0);
    float q2 = round(across * 90.0);
    float toothField = sin(q1 * 0.22 + q2 * 0.07 - t * 6.5) + 0.5 * sin(q1 * 0.11 - t * 4.2);
    float teeth = max(toothField, 0.0) * exp(-abs(across) * 18.0) * smoothstep(-0.08, 0.95, along) * upstream;

    // Infall-dominant flow with explicit pinch force and stepped bite.
    vec2 inward = -p / r;
    vec2 axisPinch = -perp * sign(across) * pinch;
    vec2 swirl = vec2(-inward.y, inward.x);
    float turbulence = fbm(st * 11.5 + vec2(t * 0.27, -t * 0.21));
    vec2 flow = normalize(
        inward * (2.5 + 1.4 * nebula)
        + axisPinch * (1.6 + 0.8 * nebula + 0.9 * teeth)
        + swirl * (0.08 + 0.12 * turbulence)
        + axis * (0.45 * teeth)
        + vec2(1e-4)
    );

    // Bright top-right beam with jagged energy teeth.
    float beamAxis = exp(-abs(across) * 38.0);
    float beamForward = smoothstep(-0.02, 0.95, along);
    float beamPulse = 0.55 + 0.45 * sin(along * 44.0 - t * 9.0 + turbulence * 11.0 + teeth * 3.0);
    float beam = beamAxis * beamForward * beamPulse * (1.0 + 0.35 * teeth);

    // Particle detail around beam + core burst.
    vec2 cell = floor((p + vec2(t * 0.95, -t * 0.35)) * 98.0);
    float particle = step(0.9915, hash(cell + vec2(floor(t * 17.0), 0.0)));
    particle *= (exp(-abs(across) * 24.0) * smoothstep(-0.24, 1.2, along + 0.15) + exp(-r * 28.0) * 1.3);
    particle += teeth * 0.35;

    float core = exp(-r * 40.0);
    float shock = exp(-pow((r - 0.052) * 44.0, 2.0));

    vec2 carry = (flow * (22.0 + 40.0 * core + 14.0 * nebula + 10.0 * teeth) + axis * beam * 15.0) * px;
    vec3 prev = texture(uPrevState, st - carry).rgb * (0.962 - 0.15 * uDt);

    vec3 gasCol = mix(vec3(0.08, 0.04, 0.16), vec3(0.64, 0.24, 0.8), nebA) * nebula;
    vec3 coreCol = vec3(1.0, 0.98, 0.9) * core;
    vec3 shockCol = vec3(1.0, 0.66, 0.26) * shock;
    vec3 beamCol = vec3(0.82, 0.96, 1.0) * beam * 1.65;
    vec3 toothCol = vec3(1.0, 0.85, 0.45) * teeth * (0.6 + 0.4 * beamPulse);
    vec3 particleCol = vec3(1.0, 1.0, 1.0) * particle * (0.45 + 0.55 * beamPulse);

    float emptiness = 1.0 - smoothstep(0.1, 0.9, nebula + core + beam * 1.45 + teeth * 0.5);

    vec3 source = vec3(0.0);
    source += gasCol;
    source += coreCol;
    source += shockCol;
    source += beamCol;
    source += toothCol;
    source += particleCol;
    source *= (1.0 - 0.8 * emptiness);

    float transfer = smoothstep(0.28, 0.0, distance(st, coreUv));
    float inject = 0.045 + 0.32 * nebula + 0.52 * core + 0.56 * beam + 0.24 * teeth + 0.28 * particle + 0.12 * transfer;

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
