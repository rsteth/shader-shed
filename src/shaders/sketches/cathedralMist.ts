/**
 * CATHEDRAL MIST SKETCH
 * Volumetric cosine folds translated from a compact one-liner.
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

    vec4 o = vec4(0.0);
    float z = 0.0;

    for (float i = 1.0; i <= 100.0; i += 1.0) {
        vec3 p = z * (vec3(fc, 0.0) * 2.0 - vec3(r, r.x)) / r.y + 1.0;
        vec3 w = p;
        float d = 0.1;

        for (float f = 1.0; f <= 5.0; f += 1.0) {
            w += sin(w.zxy * f - 9.0 * exp(-d / 0.1) + t) / f;
        }

        vec4 denom = abs(vec4(mix(p, w, 0.1).y) + vec4(0.0, 1.0, 2.0, 3.0) / 100.0);
        o += 0.03 / max(denom, vec4(0.001)) * d;

        d = 0.3 * (length(cos(p.xz)) - 0.4);
        z += d;
    }

    fragColor = tanh(o);
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
