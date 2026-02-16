/**
 * EVENTIDE HELIX SKETCH
 * Oscillatory field with stepped warps and feedback sampling.
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;

void main() {
    vec2 fc = vUv * uResolution;
    vec2 r = uResolution;
    float t = uTime;

    vec2 p = (fc * 2.0 - r) / r.y / 0.3;
    vec4 o = vec4(0.0);

    for (float i = 1.0; i <= 9.0; i += 1.0) {
        vec2 v = p;
        for (float f = 1.0; f <= 9.0; f += 1.0) {
            v += sin(ceil(v.yx * f + i * 0.7) + r - t / 2.0) / f;
        }

        float l = length(p) - 2.0 - 1.0 / max(v.y - v.x, 0.001);
        float denom = max(l, -l * 9.0);
        denom = (abs(denom) < 0.001) ? 0.001 : denom;

        o += 0.03 / denom * (cos(i / 3.0 + 0.1 / max(l, 0.001) + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0);
    }

    vec2 feedbackUv = (fc + r.y * 0.03 * sin(fc + fc.yx / 0.6)) / r;
    vec4 feedback = texture(uPrevState, feedbackUv);

    o = max(tanh(o + feedback * o), 0.0);
    fragColor = o;
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
