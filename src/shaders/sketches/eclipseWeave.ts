/**
 * ECLIPSE WEAVE SKETCH
 * Interlaced rings of shadow and emission around a moving umbra.
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
    vec2 pixel = 1.0 / uResolution;
    float t = uTime;

    vec2 focus = mix(vec2(0.5), uMouse, 0.6);
    vec2 p = st - focus;
    float r = length(p) + 1e-4;

    float rings = sin(35.0 * r - t * 2.2);
    float weaveA = sin((p.x + p.y) * 22.0 + t * 0.8);
    float weaveB = cos((p.x - p.y) * 19.0 - t * 0.7);
    float corona = smoothstep(0.18, 0.45, r) * smoothstep(0.65, 0.3, r);

    float eclipse = smoothstep(0.24, 0.04, r);
    vec3 emission = vec3(0.85, 0.35, 0.95) * max(rings, 0.0) * corona;
    emission += vec3(0.2, 0.45, 1.0) * max(weaveA * weaveB, 0.0) * (1.0 - eclipse);

    vec2 drift = vec2(weaveA, weaveB) * pixel * 12.0;
    vec3 prev = texture(uPrevState, st - drift).rgb * (0.972 - 0.15 * uDt);

    vec3 shadowCore = vec3(0.005, 0.006, 0.01) * eclipse;
    vec3 color = mix(prev, emission + shadowCore, 0.1 + 0.18 * corona);

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

    float grain = fract(sin(dot(vUv + uTime * 0.001, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.02;

    color = clamp(color, 0.0, 1.0);
    fragColor = vec4(color, uOpacity);
}
`;
