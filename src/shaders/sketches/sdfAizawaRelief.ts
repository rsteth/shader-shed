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

void carveGrooves(inout float track, vec3 p, vec3 seed, float phase) {
    vec3 a = seed;
    for (int i = 0; i < 70; i++) {
        a = stepAizawa(a, 0.0098);
    }
    for (int i = 0; i < 92; i++) {
        a = stepAizawa(a, 0.0098);
        float fi = float(i);
        vec2 q = a.xy * 0.33;
        float groove = length(p.xy - q) - (0.03 + 0.018 * sin(fi * 0.17 + uTime + phase));
        track = min(track, groove);
    }
}

float mapScene(vec3 p) {
    float slab = abs(p.z) - 0.12;
    float track = 9.0;
    carveGrooves(track, p, vec3(0.1, 0.02, 0.0), 0.0);
    carveGrooves(track, p, vec3(-0.12, 0.05, 0.02), 1.3);
    carveGrooves(track, p, vec3(0.06, -0.08, -0.01), 2.7);
    return max(slab, track);
}

vec3 normal(vec3 p) {
    vec2 e = vec2(0.0018, 0.0);
    return normalize(vec3(
        mapScene(p + e.xyy) - mapScene(p - e.xyy),
        mapScene(p + e.yxy) - mapScene(p - e.yxy),
        mapScene(p + e.yyx) - mapScene(p - e.yyx)
    ));
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec2 m = (uMouse - 0.5) * 2.0;
    vec3 ro = vec3(uv * 1.25 + vec2(m.x * 0.08, m.y * 0.06), 1.4);
    vec3 rd = normalize(vec3(0.0, 0.0, -1.0));

    float t = 0.0;
    float hit = -1.0;
    for (int i = 0; i < 70; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.001) { hit = t; break; }
        t += d * 0.9;
        if (t > 3.0) break;
    }

    vec3 paper = vec3(0.91, 0.9, 0.87) - 0.08 * vec3(vUv.y, vUv.x, 0.5);
    vec3 col = paper;

    if (hit > 0.0) {
        vec3 p = ro + rd * hit;
        vec3 n = normal(p);
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
    col = mix(prev * 0.986, col, 0.17 + uDt * 0.15);

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
