/**
 * FIREWALL SKETCH
 * Translated from a compact iterative ray-march style one-liner.
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

void main() {
    vec2 uv = vUv;
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= uResolution.x / uResolution.y;

    // Equivalent to FC.rgb*2.-r.xyx with a gentle mouse steer.
    vec3 dir = normalize(vec3(centered + (uMouse - 0.5) * 0.5, -1.0));

    float z = 0.0;
    vec4 o = vec4(0.0);
    float t = uTime;

    // for(float z,d,i;i++<4e1;){ ... }
    for (float i = 1.0; i <= 40.0; i += 1.0) {
        float d = 1.0;

        vec3 p = z * dir;
        p = vec3(
            atan(p.z + 9.0, p.x + 1.0) * 2.0,
            0.6 * p.y + t + t,
            length(p.xz) - 3.0
        );

        for (float j = 1.0; j < 7.0; j += 1.0) {
            d = j;
            p += sin(p.yzx * d + t + 0.5 * i) / d;
        }

        d = 0.4 * length(vec4(0.3 * cos(p) - 0.3, p.z));
        z += d;

        o += (cos(p.y + i * 0.4 + vec4(6.0, 1.0, 2.0, 0.0)) + 1.0) / max(d, 0.001);
    }

    vec4 firewallColor = tanh((o * o) / 6e3);

    // Keep motion continuous with a subtle feedback blend.
    vec4 prev = texture(uPrevState, uv);
    fragColor = mix(prev, firewallColor, clamp(uDt * 10.0, 0.08, 0.35));
}
`;

export const final = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uOpacity;

void main() {
    vec3 color = texture(uTexture, vUv).rgb;

    // Warm push to reinforce the "firewall" palette.
    color *= vec3(1.15, 1.02, 0.92);
    color = pow(color, vec3(0.92));

    fragColor = vec4(color, uOpacity);
}
`;
