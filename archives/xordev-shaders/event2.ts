/**
 * EVENT 2 SKETCH
 * Translation of the compact "Event 2" one-liner.
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
    vec2 v = p;

    vec4 o = vec4(0.0);

    for (float i = 1.0; i <= 9.0; i += 1.0) {
        float f = 0.0;

        v = p;
        for (f = 1.0; f <= 9.0; f += 1.0) {
            v += sin(ceil(v.yx * f + i * 0.3) + r - t / 2.0) / f;
        }

        float vy = (abs(v.y) < 0.001) ? sign(v.y) * 0.001 : v.y;
        float l = dot(p, p) - 5.0 - 2.0 / vy;
        float lSafe = (abs(l) < 0.001) ? sign(l) * 0.001 : l;

        o += 0.1 / abs(lSafe) * (cos(i / 3.0 + 0.1 / lSafe + vec4(1.0, 2.0, 3.0, 4.0)) + 1.0);
    }

    vec2 feedbackUv = (fc + r.y * 0.04 * sin(fc + fc.yx / 0.6)) / r;
    vec4 feedback = texture(uPrevState, feedbackUv);

    o = max(tanh(o + feedback * feedback), 0.0);
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
