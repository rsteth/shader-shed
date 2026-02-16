/**
 * NOCTILUCENT ARC SKETCH
 * Phase-shifted cross-product flow with sinusoidal shell growth.
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
        vec3 p = z * normalize(vec3(fc, 0.0) * 2.0 - vec3(r, r.x));
        vec3 a = vec3(-1.0, 0.0, 0.0);
        p.z += 5.0;

        float s = -t - z;
        a = mix(dot(a, p) * a, p, sin(s)) + cos(s) * cross(a, p);

        float d = 1.0;
        for (float j = 1.0; j <= 9.0; j += 1.0) {
            a += sin(ceil(a * j) - t).yzx / j;
            d = j;
        }

        s = sqrt(max(length(a.yz), 0.001));
        d = max(length(sin(a)) * s / 20.0, 0.001);
        z += d;

        o += vec4(z, 1.0, s, 1.0) / (max(s, 0.001) * d);
    }

    fragColor = tanh(o / 5e3);
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
