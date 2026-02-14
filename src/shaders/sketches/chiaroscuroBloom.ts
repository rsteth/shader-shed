/**
 * CHIAROSCURO BLOOM SKETCH
 * Light-vs-dark ink plumes with feedback-driven bloom.
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

    vec2 center = vec2(0.5);
    vec2 p = st - center;
    float r = length(p);
    float angle = atan(p.y, p.x);

    float swirl = fbm(vec2(angle * 2.0, r * 8.0 - t * 0.35));
    float folds = sin(11.0 * angle + 18.0 * r - t * 1.6 + swirl * 4.0);
    float shadowMask = smoothstep(-0.2, 0.7, folds - r * 1.1);

    vec2 curl = vec2(
        fbm(st * 5.0 + vec2(0.0, t * 0.12)) - 0.5,
        fbm(st.yx * 5.0 + vec2(17.0, -t * 0.1)) - 0.5
    );

    vec2 advectUv = st - curl * pixel * 14.0;
    vec3 prev = texture(uPrevState, advectUv).rgb * (0.975 - 0.2 * uDt);

    float mouseBloom = smoothstep(0.18, 0.0, distance(st, uMouse));

    vec3 paperWhite = vec3(0.96, 0.93, 0.88);
    vec3 inkBlack = vec3(0.02, 0.02, 0.03);
    vec3 palette = mix(inkBlack, paperWhite, shadowMask);
    palette += mouseBloom * vec3(0.25, 0.18, 0.1);

    vec3 color = mix(prev, palette, 0.09 + 0.16 * mouseBloom);
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

    float vignette = smoothstep(0.95, 0.18, distance(vUv, vec2(0.5)));
    float pulse = 0.95 + 0.05 * sin(uTime * 0.4 + (vUv.x + vUv.y) * 4.0);

    color *= vignette * pulse;
    color = pow(color, vec3(0.92));

    fragColor = vec4(color, uOpacity);
}
`;
