/**
 * SDF AIZAWA RELIEF
 * Planar SDF slab carved by attractor-driven distance fields.
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

vec3 aizawa(vec3 p, vec4 k) {
    return vec3(
        (p.z - k.y) * p.x - k.w * p.y,
        k.w * p.x + (p.z - k.y) * p.y,
        k.z + k.x * p.z - (p.z * p.z * p.z) / 3.0 - (p.x * p.x + p.y * p.y) * (1.0 + 0.25 * p.z) + 0.1 * p.z * p.x * p.x * p.x
    );
}

vec3 stepAizawa(vec3 p, float dt, vec4 k) {
    vec3 k1 = aizawa(p, k);
    vec3 k2 = aizawa(p + 0.5 * dt * k1, k);
    return p + dt * k2;
}

float mapScene(vec3 p, vec4 k) {
    float slab = abs(p.z) - 0.12;

    float track = 9.0;
    vec3 a = vec3(0.1, 0.0, 0.0);
    for (int i = 0; i < 80; i++) {
        a = stepAizawa(a, 0.012, k);
        vec2 q = a.xy * 0.34;
        float fi = float(i);
        float groove = length(p.xy - q) - (0.03 + 0.02 * sin(fi * 0.17 + uTime));
        track = min(track, groove);
    }

    return max(slab, track);
}

vec3 normal(vec3 p, vec4 k) {
    vec2 e = vec2(0.0018, 0.0);
    return normalize(vec3(
        mapScene(p + e.xyy, k) - mapScene(p - e.xyy, k),
        mapScene(p + e.yxy, k) - mapScene(p - e.yxy, k),
        mapScene(p + e.yyx, k) - mapScene(p - e.yyx, k)
    ));
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec2 m = (uMouse - 0.5) * 2.0;
    vec4 k = vec4(0.95 + m.x * 0.06, 0.7, 0.6 + m.y * 0.06, 3.48);

    vec3 ro = vec3(uv * 1.25, 1.4);
    vec3 rd = normalize(vec3(0.0, 0.0, -1.0));

    float t = 0.0;
    float hit = -1.0;
    for (int i = 0; i < 70; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p, k);
        if (d < 0.001) { hit = t; break; }
        t += d * 0.9;
        if (t > 3.0) break;
    }

    vec3 paper = vec3(0.91, 0.9, 0.87) - 0.08 * vec3(vUv.y, vUv.x, 0.5);
    vec3 col = paper;

    if (hit > 0.0) {
        vec3 p = ro + rd * hit;
        vec3 n = normal(p, k);
        vec3 l = normalize(vec3(-0.4, 0.6, 0.7));
        float diff = max(dot(n, l), 0.0);
        float cavity = smoothstep(-0.02, 0.08, p.z);
        vec3 pigmentA = vec3(0.08, 0.16, 0.25);
        vec3 pigmentB = vec3(0.26, 0.08, 0.16);
        vec3 pigment = mix(pigmentA, pigmentB, 0.5 + 0.5 * sin((p.x + p.y) * 20.0 + uTime));
        col = mix(paper, pigment, 0.55 + 0.35 * cavity);
        col *= 0.75 + 0.45 * diff;
    }

    vec3 prev = texture(uPrevState, vUv).rgb;
    col = mix(prev * 0.985, col, 0.17 + uDt * 0.15);

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
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`;
