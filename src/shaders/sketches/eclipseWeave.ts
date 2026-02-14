/**
 * ECLIPSE WEAVE SKETCH
 * Chaotic umbral transfer field with splintered corona filaments.
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

    vec2 attractor = mix(vec2(0.5), uMouse, 0.72);
    vec2 p = st - attractor;

    vec2 domain = vec2(
        fbm(st * 2.7 + vec2(t * 0.1, -t * 0.18)),
        fbm(st.yx * 3.4 + vec2(7.0, t * 0.14))
    ) - 0.5;

    vec2 current = vec2(
        fbm((st + domain * 0.35) * 6.2 + vec2(21.0, -t * 0.31)),
        fbm((st.yx - domain * 0.25) * 5.8 + vec2(-16.0, t * 0.27))
    ) - 0.5;

    vec2 drift = normalize(domain + current + vec2(1e-4));
    float r = length(p + current * 0.28) + 1e-4;

    float umbra = smoothstep(0.26, 0.02, r + dot(drift, p) * 0.25);
    float shell = smoothstep(0.12, 0.62, r) * smoothstep(0.88, 0.25, r);

    float burstA = sin(42.0 * r - t * 2.7 + current.x * 16.0);
    float burstB = sin(dot(p + current * 0.3, normalize(vec2(0.74, -0.53))) * 36.0 + t * 1.9);
    float burstC = fbm((st + drift * 0.3) * 14.0 - t * 0.42) - 0.45;

    float filaments = smoothstep(0.25, 1.15, burstA + burstB + burstC * 2.4);

    vec3 corona = vec3(0.9, 0.4, 1.0) * pow(max(burstA, 0.0), 1.8) * shell;
    corona += vec3(0.2, 0.7, 1.0) * filaments * (1.0 - umbra) * (0.3 + shell);

    float transfer = smoothstep(0.35, 0.0, distance(st, uMouse));
    vec2 carry = (drift * (20.0 + 16.0 * filaments) + current * 12.0) * px;
    vec3 prev = texture(uPrevState, st - carry).rgb * (0.964 - 0.2 * uDt);

    vec3 sink = vec3(0.004, 0.005, 0.009) * (umbra + transfer * 0.35);
    vec3 inject = corona + sink;

    float gain = 0.07 + 0.2 * filaments + 0.18 * transfer;
    vec3 color = mix(prev, inject, gain);

    fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

export const final = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uTime;

void main() {
    vec3 color = texture(uTexture, vUv).rgb;

    float grain = fract(sin(dot(vUv * (1.0 + 0.04 * sin(uTime * 0.2)), vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.018;

    float gate = 0.96 + 0.04 * sin((vUv.x + vUv.y) * 42.0 - uTime * 1.2);
    color *= gate;

    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`;
