/**
 * UMBRA DRIFT SKETCH
 * Slow fog currents where dark pockets carve paths through color.
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
    float t = uTime * 0.45;

    vec2 n = vec2(
        fbm(st * 3.2 + vec2(0.0, t)) - 0.5,
        fbm(st * 3.2 + vec2(9.0, -t * 1.1)) - 0.5
    );

    vec2 flow = vec2(n.y, -n.x);
    vec3 prev = texture(uPrevState, st - flow * pixel * 20.0).rgb * (0.98 - 0.1 * uDt);

    float mist = fbm(st * 2.6 + flow * 0.9 + vec2(t * 0.4, -t * 0.35));
    float bands = 0.5 + 0.5 * sin((st.x * 7.0 - st.y * 5.0) + t * 2.4 + mist * 3.14);

    float mouseWell = smoothstep(0.3, 0.0, distance(st, uMouse));
    float darkness = smoothstep(0.62, 0.28, mist + mouseWell * 0.25);

    vec3 low = vec3(0.03, 0.05, 0.09);
    vec3 high = vec3(0.2, 0.56, 0.7);
    vec3 base = mix(low, high, bands * mist);
    base = mix(base, vec3(0.0), darkness * 0.75);

    vec3 color = mix(prev, base, 0.08 + 0.1 * mouseWell);
    fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

export const final = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uOpacity;
uniform vec2 uResolution;

void main() {
    vec3 color = texture(uTexture, vUv).rgb;

    vec2 p = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    float vignette = smoothstep(0.95, 0.2, length(p));

    color = pow(color, vec3(1.07));
    color *= vignette;

    fragColor = vec4(color, uOpacity);
}
`;
