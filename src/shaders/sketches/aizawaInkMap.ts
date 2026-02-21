/**
 * AIZAWA INK MAP
 * Planar interpretation using contour-like density bands.
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
    const float a = 0.95;
    const float b = 0.7;
    const float c = 0.6;
    const float d = 3.5;
    const float e = 0.25;
    const float f = 0.1;
    return vec3(
        (p.z - b) * p.x - d * p.y,
        d * p.x + (p.z - b) * p.y,
        c + a * p.z - (p.z * p.z * p.z) / 3.0 - (p.x * p.x + p.y * p.y) * (1.0 + e * p.z) + f * p.z * p.x * p.x * p.x
    );
}

vec3 stepAizawa(vec3 p, float dt) {
    vec3 k1 = aizawa(p);
    vec3 k2 = aizawa(p + 0.5 * dt * k1);
    vec3 k3 = aizawa(p + 0.5 * dt * k2);
    vec3 k4 = aizawa(p + dt * k3);
    return p + (dt / 6.0) * (k1 + 2.0 * k2 + 2.0 * k3 + k4);
}

void stampTrajectory(vec3 p, vec2 uv, inout float stamp, inout float ridges, float phase) {
    vec2 q = p.xy * 0.34;
    float d = length(uv - q);
    stamp += exp(-d * 72.0);
    ridges += exp(-abs(d - 0.08 - 0.018 * sin(phase)) * 180.0);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec2 m = (uMouse - 0.5) * 2.0;
    vec3 p0 = vec3(0.1 + m.x * 0.02, m.y * 0.02, 0.0);
    vec3 p1 = vec3(-0.12, 0.04, 0.03);
    vec3 p2 = vec3(0.06, -0.08, 0.02);

    for (int i = 0; i < 140; i++) {
        p0 = stepAizawa(p0, 0.0095);
        p1 = stepAizawa(p1, 0.0095);
        p2 = stepAizawa(p2, 0.0095);
    }

    float stamp = 0.0;
    float ridges = 0.0;

    for (int i = 0; i < 250; i++) {
        float fi = float(i);
        p0 = stepAizawa(p0, 0.0095);
        p1 = stepAizawa(p1, 0.0095);
        p2 = stepAizawa(p2, 0.0095);
        stampTrajectory(p0, uv, stamp, ridges, fi * 0.22 + uTime);
        stampTrajectory(p1, uv, stamp, ridges, fi * 0.25 + uTime * 1.1);
        stampTrajectory(p2, uv, stamp, ridges, fi * 0.2 + uTime * 0.9);
    }

    float field = stamp * 0.009;
    float contour = smoothstep(0.075, 0.64, field);
    float rings = clamp(ridges * 0.007, 0.0, 1.0);

    vec3 paper = vec3(0.96, 0.93, 0.9) - (0.08 * (vUv.y + vUv.x));
    vec3 ink = mix(vec3(0.08, 0.15, 0.24), vec3(0.2, 0.05, 0.16), rings);
    vec3 col = mix(paper, ink, contour * 0.9);
    col -= rings * 0.18;

    vec3 prev = texture(uPrevState, vUv).rgb;
    col = mix(prev * 0.987, col, 0.15 + uDt * 0.2);

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export const final = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform float uOpacity;

void main() {
    vec3 color = texture(uTexture, vUv).rgb;
    fragColor = vec4(color, uOpacity);
}
`;
