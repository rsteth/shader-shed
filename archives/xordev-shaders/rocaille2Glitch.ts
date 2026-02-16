/**
 * ROCAILLE 2 GLITCH SKETCH
 * Rocaille 2 structure remixed with Event 2-style stepped warping and feedback trails.
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

    // Keep Rocaille 2 framing / scale feel.
    vec2 p = (fc * 2.0 - r) / r.y / 0.3;
    vec2 v = p;
    vec4 o = vec4(0.0);

    for (float i = 1.0; i <= 10.0; i += 1.0) {
        v = p;

        // Rocaille 2 core (no +r phase term), but with Event-2-like quantized stepping.
        for (float f = 1.0; f <= 9.0; f += 1.0) {
            vec2 q = ceil(v.yx * f + i * 0.28 + t * 0.15);
            v += sin(q + t * vec2(0.9, -0.7)) / f;
        }

        float lace = max(length(v), 0.001);
        float cut = abs(dot(p, p) - 4.2 - 1.4 / max(abs(v.y), 0.02));
        float glitch = max(cut, 0.001);

        vec4 palette = cos(i + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0;
        o += palette * (0.085 / lace + 0.02 / glitch);
    }

    // Event 2-like warped feedback sample for glitchy persistence.
    vec2 feedbackUv = (fc + r.y * 0.04 * sin(fc + fc.yx / 0.6 + t * vec2(1.2, -1.6))) / r;
    vec4 feedback = texture(uPrevState, feedbackUv);

    vec3 base = tanh(o.rgb * o.rgb);

    // Keep trails, but avoid positive-only energy accumulation that eventually blows out to white.
    const float feedbackGain = 0.4;
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
