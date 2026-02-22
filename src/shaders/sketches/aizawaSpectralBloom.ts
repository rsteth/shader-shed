/**
 * AIZAWA SPECTRAL BLOOM
 * Layered enclosed attractor petals with spectral breathing motion.
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

    vec3 p = vec3(
        uv.x * 0.6 + 0.17 + 0.04 * sin(t * 0.9),
        uv.y * 0.6 + 0.09 + 0.05 * cos(t * 0.8),
        0.1
    );

    float dt = 0.0105;
    float petals = 0.0;
    float core = 0.0;

    for (int i = 0; i < 70; i++) {
        p = rk4(p, dt);
        float fi = float(i);

        float breathe = 1.0 + 0.18 * sin(t * 1.9 + fi * 0.11);
        vec2 proj = vec2(p.x * 0.52 + p.z * 0.34, p.y * 0.56 - p.z * 0.22);
        proj *= breathe;

        float theta = atan(proj.y, proj.x) + t * 0.25;
        float radialMod = 1.0 + 0.22 * sin(theta * 5.0 + t * 1.4);
        proj *= radialMod;
        proj += mouse * 0.12;

        float d = length(uv - proj * 0.52);
        petals += exp(-d * 20.0) * (0.65 + 0.35 * sin(theta * 3.0 + fi * 0.2));
        core += exp(-d * 84.0);
    }

    petals /= 70.0;
    core /= 70.0;

    vec3 spectral = vec3(
        smoothstep(0.03, 0.45, petals),
        smoothstep(0.05, 0.5, petals + core * 0.4),
        smoothstep(0.02, 0.4, petals * 0.7 + core)
    );

    spectral *= vec3(0.95, 0.85, 1.15);
    spectral += vec3(0.36, 0.76, 0.92) * smoothstep(0.008, 0.075, core);

    vec3 prev = texture(uPrevState, vUv + vec2(0.0015 * sin(t), 0.0012 * cos(t * 0.7))).rgb * (0.966 - 0.07 * uDt);
    vec3 col = max(prev, spectral * (0.58 + petals * 1.15));

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

    float chroma = sin((vUv.x - vUv.y) * 50.0 + uTime * 0.8) * 0.012;
    c.r += chroma;
    c.b -= chroma;

    c = pow(c, vec3(0.92, 0.95, 0.9));

    float vignette = smoothstep(1.0, 0.18, distance(vUv, vec2(0.5, 0.5)));
    c *= vignette;

    fragColor = vec4(clamp(c, 0.0, 1.0), uOpacity);
}
`;
