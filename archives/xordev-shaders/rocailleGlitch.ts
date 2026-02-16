/**
 * ROCAILLE GLITCH SKETCH
 * Rocaille-style filigree infused with Event 2-like quantized warping and feedback.
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

    vec2 p = (fc * 2.0 - r) / r.y / 0.32;
    vec2 v = p;
    vec4 o = vec4(0.0);

    for (float i = 1.0; i <= 10.0; i += 1.0) {
        v = p;

        for (float f = 1.0; f <= 9.0; f += 1.0) {
            vec2 grid = ceil(v.yx * f * 1.2 + i * 0.37);
            v += sin(grid + r * 0.003 + t * vec2(0.8, -0.6)) / f;
        }

        float lace = max(length(v), 0.001);
        float cut = abs(dot(p, p) - 3.2 - 1.6 / max(abs(v.y), 0.02));
        float glitch = max(cut, 0.001);

        vec4 palette = cos(i / 2.7 + vec4(0.0, 1.3, 2.6, 3.9)) + 1.0;
        o += palette * (0.07 / lace + 0.03 / glitch);
    }

    vec2 feedbackUv = (fc + r.y * 0.035 * sin(fc.yx / 0.7 + t * vec2(1.7, -1.3))) / r;
    vec4 feedback = texture(uPrevState, feedbackUv);

    vec3 base = tanh(o.rgb * o.rgb * 0.9);

    // Keep trails, but avoid positive-only energy accumulation that eventually blows out to white.
    const float feedbackGain = 0.42;
    const float decay = 0.97;
    vec3 mixed = max(base + feedback.rgb * feedbackGain, 0.0) * decay;
    mixed = 1.0 - exp(-mixed);

    fragColor = vec4(mixed, 1.0);
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
