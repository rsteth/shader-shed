/**
 * HINGE BLOOM SKETCH
 * Expanding ray-march with trigonometric hinge constraints.
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
        p.z -= t;

        float d = abs(0.01 * z - 0.1);
        float shape = length(vec2(
            3.0 - abs(p.y) + dot(cos(p + 0.3 * t), sin(0.3 * t - 0.6 * p.yzx)),
            cos(p.z / 0.3 - p.z) * 0.3
        ));

        d = max(d, 0.5 * shape - d);
        d = max(d, 0.001);

        o += (cos(i / 9.0 + vec4(2.0, 1.0, 0.0, 0.0)) + 1.0) / (d * max(z, 0.001));
        z += d;
    }

    fragColor = tanh(o / 8e1);
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
