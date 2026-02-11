/**
 * ROCAILLE 2 SKETCH
 * Translation of the compact "Rocaille 2" one-liner.
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform float uTime;
uniform vec2 uResolution;

void main() {
    vec2 fc = vUv * uResolution;
    vec2 r = uResolution;
    float t = uTime;

    vec2 p = (fc * 2.0 - r) / r.y / 0.3;
    vec2 v = p;

    vec4 o = vec4(0.0);

    for (float i = 1.0; i <= 10.0; i += 1.0) {
        float f = 0.0;

        v = p;
        for (f = 1.0; f <= 9.0; f += 1.0) {
            v += sin(v.yx * f + i + t) / f;
        }

        float denom = max(length(v), 0.001);
        o += (cos(i + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / 6.0 / denom;
    }

    fragColor = tanh(o * o);
}
`;

export const final = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uOpacity;

void main() {
    vec4 tex = texture(uTexture, vUv);
    fragColor = vec4(tex.rgb, uOpacity);
}
`;
