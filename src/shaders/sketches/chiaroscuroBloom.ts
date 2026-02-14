/**
 * CHIAROSCURO BLOOM SKETCH
 * Energetic light-vs-shadow plumes with directional transfer and feedback bloom.
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

    vec2 center = mix(vec2(0.5), uMouse, 0.35);
    vec2 p = st - center;

    vec2 warpA = vec2(
        fbm(st * 3.8 + vec2(t * 0.18, -t * 0.11)),
        fbm(st.yx * 4.6 + vec2(13.0, t * 0.14))
    ) - 0.5;

    vec2 warpB = vec2(
        fbm((st + warpA * 0.35) * 8.2 + vec2(29.0, -t * 0.24)),
        fbm((st.yx - warpA * 0.28) * 7.4 + vec2(-11.0, t * 0.31))
    ) - 0.5;

    vec2 flow = normalize(warpA + warpB + vec2(1e-4));
    float chaos = fbm((st + flow * 0.12) * 6.5 + vec2(t * 0.22, -t * 0.16));

    float r = length(p + warpB * 0.25);
    float veins = sin(19.0 * r - t * 1.7 + chaos * 9.0 + dot(flow, p) * 20.0);
    float fracture = fbm((st + flow * 0.4) * 18.0 - t * 0.5) - 0.5;

    float lightMask = smoothstep(-0.45, 0.72, veins + fracture * 2.2);
    float transfer = smoothstep(0.2, 0.0, distance(st, uMouse));

    vec2 transport = (flow * (15.0 + chaos * 20.0) + warpB * 10.0) * px;
    vec3 prev = texture(uPrevState, st - transport).rgb * (0.967 - 0.22 * uDt);

    vec3 blackCore = vec3(0.01, 0.01, 0.015);
    vec3 warmGlow = vec3(0.98, 0.93, 0.86);
    vec3 electricEdge = vec3(1.0, 0.62, 0.35);

    vec3 base = mix(blackCore, warmGlow, lightMask);
    base += electricEdge * pow(max(veins, 0.0), 2.2) * (0.2 + 0.8 * transfer);

    float injection = 0.06 + 0.22 * transfer + 0.1 * smoothstep(0.35, 0.8, chaos);
    vec3 color = mix(prev, base, injection);

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

    float vignette = smoothstep(1.0, 0.12, distance(vUv, vec2(0.5)));
    float shimmer = 0.96 + 0.04 * sin((vUv.x - vUv.y) * 16.0 + uTime * 0.8);

    color *= vignette * shimmer;
    color = pow(color, vec3(0.91));

    fragColor = vec4(color, uOpacity);
}
`;
