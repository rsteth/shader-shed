/**
 * FURNACE MIRE SKETCH
 * Chaotic folded volume with rounded-step harmonic feedback.
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
        vec3 a = vec3(0.57);
        p.z += 9.0;

        a = dot(a, p) * a * cross(a, p);
        float s = sqrt(max(length(a.xz - a.y - 0.8), 0.001));

        float d = 2.0;
        for (float j = 2.0; j <= 9.0; j += 1.0) {
            a += sin(round(a * j) - t).yzx / j;
            d = j;
        }

        d = max(length(sin(a / 0.1)) * s / 20.0, 0.001);
        z += d;
        o += vec4(s, 2.0, z, 1.0) / (max(s, 0.001) * d);
    }

    fragColor = tanh(o / 4e3);
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
