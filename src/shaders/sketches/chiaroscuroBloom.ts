/**
 * CHIAROSCURO BLOOM SKETCH
 * Quasar-style choke point: sparse space pulls into center, then erupts as jets.
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

void main() {
    vec2 st = vUv;
    vec2 px = 1.0 / uResolution;
    float t = uTime;

    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 center = vec2(0.5) + (uMouse - 0.5) * vec2(0.12, 0.12);
    vec2 p = (st - center) * aspect;

    float r = length(p) + 1e-4;
    vec2 inward = -p / r;
    vec2 tangent = vec2(-inward.y, inward.x);

    float spiral = fbm(st * 7.5 + vec2(t * 0.16, -t * 0.13));
    vec2 flow = normalize(inward * (1.35 + 0.85 * spiral) + tangent * (0.5 + 0.6 * sin(t + r * 22.0)) + vec2(1e-4));

    // Mostly empty space away from the core
    float emptiness = smoothstep(0.22, 0.92, r);

    // Chokepoint core
    float core = exp(-r * 26.0);
    float accretion = exp(-pow((r - 0.09) * 22.0, 2.0)) * (0.6 + 0.4 * sin(28.0 * atan(p.y, p.x) + t * 3.4));

    // Opposing quasar jets along X axis
    float jetAxis = exp(-abs(p.y) * 38.0);
    float jetReach = smoothstep(0.06, 0.9, abs(p.x));
    float jetPulse = 0.55 + 0.45 * sin(abs(p.x) * 18.0 - t * 4.2 + spiral * 8.0);
    float jets = jetAxis * jetReach * jetPulse;

    vec2 carry = flow * px * (22.0 + 20.0 * core + 12.0 * jets);
    vec3 prev = texture(uPrevState, st - carry).rgb * (0.964 - 0.18 * uDt);

    vec3 space = vec3(0.0);
    vec3 coreCol = vec3(1.0, 0.94, 0.78) * core;
    vec3 ringCol = vec3(1.0, 0.62, 0.28) * max(accretion, 0.0);
    vec3 jetCol = vec3(0.55, 0.78, 1.0) * jets;

    vec3 source = space;
    source += coreCol;
    source += ringCol;
    source += jetCol;
    source *= (1.0 - 0.92 * emptiness);

    float transfer = smoothstep(0.26, 0.0, distance(st, uMouse));
    float inject = 0.035 + 0.42 * core + 0.28 * jets + 0.15 * transfer;
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

    float r = distance(vUv, vec2(0.5));
    float vignette = smoothstep(1.0, 0.08, r);
    float flare = 0.97 + 0.03 * sin((vUv.x - 0.5) * 120.0 + uTime * 3.5) * exp(-abs(vUv.y - 0.5) * 18.0);

    color *= vignette * flare;
    color = pow(color, vec3(0.9));

    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`;
