/**
 * AXIAL CHOIR SKETCH
 * Rotated ray bundle with anisotropic depth modulation.
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

    for (float i = 1.0; i <= 50.0; i += 1.0) {
        vec3 p = z * normalize(vec3(fc, 0.0) * 2.0 - vec3(r, r.x));
        p.z += 9.0;

        vec3 v = normalize(cos((t + i) / 2.0 + vec3(6.0, 1.0, 4.0)));
        p = dot(v, p) * v + cross(v, p);

        float d = max(0.2 * length(p.xy / vec2(1.0, 9.0)), 0.001);
        o += vec4(3.0, z, 6.0, 1.0) / (d * max(z, 0.001));
        z += d;
    }

    fragColor = tanh(o / 2e2);
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
