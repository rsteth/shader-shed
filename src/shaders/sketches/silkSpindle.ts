/**
 * SILK SPINDLE SKETCH
 * Cross-product drift fields with stepped cosine perturbations.
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

    for (float i = 1.0; i <= 40.0; i += 1.0) {
        vec3 p = z * normalize(vec3(fc, 0.0) * 2.0 - vec3(r, r.x));
        vec3 a = vec3(0.0, 1.0, 0.0);

        p.z += 6.0;
        float h = t - length(p * p.yzx);
        a = mix(dot(a, p) * a, p, sin(h)) + cos(h) * cross(a, p);

        float d = 1.0;
        for (float j = 1.0; j <= 9.0; j += 1.0) {
            a -= cos(round(a * j) + t).zxy / j;
            d = j;
        }

        d = max(0.1 * length(a.xz), 0.001);
        z += d;
        o += vec4(h, 1.0, 4.0, 1.0) / d;
    }

    fragColor = tanh(o / 2e3);
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
