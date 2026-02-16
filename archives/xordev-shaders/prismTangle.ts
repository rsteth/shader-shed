/**
 * PRISM TANGLE SKETCH
 * Rounded fold lattice with radial color grading.
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

    for (float i = 1.0; i <= 60.0; i += 1.0) {
        vec3 p = z * normalize(vec3(fc, 0.0) * 2.0 - vec3(r, r.x));
        vec3 a = p - 0.9 * p.xzy;
        p.z += 5.0;

        float d = 1.0;
        for (float j = 1.0; j <= 9.0; j += 1.0) {
            a += sin(round(a * j).yzx + t) / j;
            d = j;
        }

        float l = length(p);
        d = max(length(vec4(sin(a * a) * 0.3, cos(l / 0.3))) / 6.0, 0.001);
        z += d;
        o += vec4(l, 2.0, z, 1.0) / (d * max(l, 0.001) * max(z, 0.001));
    }

    fragColor = tanh(o * o / 1e6);
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
