/**
 * LAPSE SKETCH
 * A translated compact shader: iterative volumetric fold + temporal tone mapping.
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
    vec2 centered = (uv * 2.0 - 1.0);
    centered.x *= uResolution.x / uResolution.y;

    // Slight mouse steering to keep it interactive.
    vec2 mouse = (uMouse - 0.5) * 0.7;
    centered += mouse;

    float t = uTime;
    vec4 acc = vec4(0.0);
    float z = 0.0;

    // Translation of:
    // for(float i,z,d,h;i++<5e1;o+=vec4(3,z,i,1)/d) { ... }
    for (float i = 1.0; i <= 50.0; i += 1.0) {
        float d = 1.0;
        float h = 0.0;

        vec3 p = z * normalize(vec3(centered, -1.0));
        vec3 a = vec3(0.0, 1.0, 0.0);

        p.z += 7.0;

        h = length(p) - t;
        a = mix(dot(a, p) * a, p, sin(h)) + cos(h) * cross(a, p);

        for (float j = 1.0; j <= 9.0; j += 1.0) {
            d += 1.0;
            a += sin(round(a * d) - t).zxy / d;
        }

        z += 0.1 * length(a.xz);
        d = max(d, 0.001);
        acc += vec4(3.0, z, i, 1.0) / d;
    }

    vec4 lapseColor = tanh(acc / 1e4);

    // Small feedback blend to smooth transitions frame-to-frame.
    vec4 prev = texture(uPrevState, uv);
    fragColor = mix(prev, lapseColor, clamp(uDt * 12.0, 0.08, 0.4));
}
`;

export const final = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uOpacity;

void main() {
    vec3 color = texture(uTexture, vUv).rgb;

    // Gentle contrast curve and lift.
    color = pow(color, vec3(0.9));
    color = color * 1.15;

    fragColor = vec4(color, uOpacity);
}
`;
