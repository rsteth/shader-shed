/**
 * EMBER ARRAY SKETCH
 * Dense iterative orbital folds with chromatic accumulation.
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

    for (float i = 1.0; i <= 80.0; i += 1.0) {
        vec3 p = z * normalize(vec3(fc, 0.0) * 2.0 - vec3(r, r.x));
        vec3 a = vec3(0.0);

        p.z += 9.0;
        float h = dot(p, p / max(abs(p), vec3(0.001))) - t;
        a = mix(dot(a + 0.5, p) * (a + 0.5), p, sin(h)) + cos(h) * cross(a + 0.5, p);

        float d = 0.0;
        for (float j = 1.0; j <= 9.0; j += 1.0) {
            a += 0.3 * sin(a * j).zxy;
            d = j;
        }

        d = max(length(a.xz) / 15.0, 0.001);
        z += d;
        o += vec4(9.0, 5.0, h + t, 1.0) / d;
    }

    fragColor = tanh(o / 1e4);
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
