/**
 * AIZAWA GHOST VEIL
 * Wispy enclosed shells from RK4-integrated Aizawa trajectories.
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

vec3 aizawa(vec3 p) {
    float a = 0.95;
    float b = 0.7;
    float c = 0.6;
    float d = 3.5;
    float e = 0.25;
    float f = 0.1;

    float x = p.x;
    float y = p.y;
    float z = p.z;

    float dx = (z - b) * x - d * y;
    float dy = d * x + (z - b) * y;
    float dz = c + a * z - (z * z * z) / 3.0 - (x * x + y * y) * (1.0 + e * z) + f * z * x * x * x;
    return vec3(dx, dy, dz);
}

vec3 rk4(vec3 p, float h) {
    vec3 k1 = aizawa(p);
    vec3 k2 = aizawa(p + 0.5 * h * k1);
    vec3 k3 = aizawa(p + 0.5 * h * k2);
    vec3 k4 = aizawa(p + h * k3);
    return p + (h / 6.0) * (k1 + 2.0 * k2 + 2.0 * k3 + k4);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    float t = uTime;
    vec2 mouse = (uMouse - 0.5) * 2.0;

    float envelope = 0.0;
    float filament = 0.0;

    vec3 p = vec3(
        uv.x * 0.55 + 0.14 + 0.06 * sin(t * 0.39 + uv.y * 3.1),
        uv.y * 0.55 + 0.11 + 0.05 * cos(t * 0.31 + uv.x * 2.9),
        0.07 + 0.04 * sin(t * 0.23)
    );

    float dt = 0.012;
    vec2 wobble = vec2(sin(t * 0.7), cos(t * 0.6)) * 0.08 + mouse * 0.18;

    for (int i = 0; i < 64; i++) {
        p = rk4(p, dt);
        float fi = float(i);

        float breathing = 0.94 + 0.14 * sin(t * 1.1 + fi * 0.09);
        vec2 proj = vec2(
            p.x * 0.66 + p.z * 0.23,
            p.y * breathing - p.z * 0.16
        );
        proj += wobble * sin(fi * 0.08 + t * 0.8);

        float d = length(uv - proj * 0.38);
        envelope += exp(-d * 14.0) * (0.72 + 0.28 * sin(fi * 0.21 + t));
        filament += exp(-d * 55.0);
    }

    envelope /= 64.0;
    filament /= 64.0;

    vec3 ghost = mix(vec3(0.03, 0.05, 0.08), vec3(0.56, 0.95, 1.0), smoothstep(0.05, 0.55, envelope));
    ghost += vec3(0.28, 0.5, 0.95) * smoothstep(0.015, 0.13, filament);

    vec3 prev = texture(uPrevState, vUv + vec2(0.0008, -0.0012)).rgb * (0.968 - 0.08 * uDt);
    vec3 col = max(prev, ghost * (0.7 + 1.1 * envelope));

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export const final = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uTime;

void main() {
    vec3 c = texture(uTexture, vUv).rgb;
    float pulse = 0.95 + 0.08 * sin(uTime * 1.7 + vUv.y * 7.0);
    c *= pulse;

    float halo = smoothstep(0.9, 0.2, distance(vUv, vec2(0.5)));
    c += vec3(0.07, 0.09, 0.16) * halo;

    fragColor = vec4(clamp(c, 0.0, 1.0), uOpacity);
}
`;
