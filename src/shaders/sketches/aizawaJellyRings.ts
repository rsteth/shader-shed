/**
 * AIZAWA JELLY RINGS
 * Membrane-like loops and tendrils from animated Aizawa projections.
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

    return vec3(
        (z - b) * x - d * y,
        d * x + (z - b) * y,
        c + a * z - (z * z * z) / 3.0 - (x * x + y * y) * (1.0 + e * z) + f * z * x * x * x
    );
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
    vec2 mouse = (uMouse - 0.5) * 2.0;
    float t = uTime;

    vec3 p = vec3(
        uv.x * 0.42 + 0.19,
        uv.y * 0.48 + 0.13 + 0.03 * sin(t * 0.6),
        0.08 + 0.04 * cos(t * 0.47)
    );

    float shell = 0.0;
    float tendril = 0.0;
    float dt = 0.0098;

    for (int i = 0; i < 72; i++) {
        p = rk4(p, dt);
        float fi = float(i);

        float ang = t * 0.22 + fi * 0.03;
        mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));

        vec2 proj = vec2(p.x * 0.61 + p.z * 0.27, p.y * 0.66 - p.z * 0.12);
        proj = rot * proj;

        float bell = 0.85 + 0.2 * sin(t * 2.2 + fi * 0.18);
        proj.y *= bell;
        proj += mouse * vec2(0.14, 0.09);

        float d = length(uv - proj * 0.56);
        shell += exp(-abs(d - 0.13) * 34.0);
        tendril += exp(-d * 92.0) * smoothstep(0.2, 1.0, sin(fi * 0.37 + t * 1.3) * 0.5 + 0.5);
    }

    shell /= 72.0;
    tendril /= 72.0;

    vec3 membrane = mix(vec3(0.02, 0.02, 0.06), vec3(0.7, 0.25, 0.95), smoothstep(0.06, 0.42, shell));
    membrane += vec3(0.24, 0.62, 0.92) * smoothstep(0.008, 0.08, tendril);

    vec3 prev = texture(uPrevState, vUv + vec2(-0.0011, 0.0015)).rgb * (0.962 - 0.06 * uDt);
    vec3 col = mix(prev, membrane, 0.25 + 0.48 * shell);

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
    float shimmer = 0.018 * sin(uTime * 3.0 + vUv.x * 40.0) + 0.018 * cos(uTime * 2.2 + vUv.y * 36.0);
    c += shimmer;

    float vignette = smoothstep(1.1, 0.24, distance(vUv, vec2(0.5, 0.52)));
    c *= vignette;

    fragColor = vec4(clamp(c, 0.0, 1.0), uOpacity);
}
`;
