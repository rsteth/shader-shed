/**
 * SDF AIZAWA FILAMENT
 * Raymarched tube formed by sampling an Aizawa trajectory.
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

mat3 rotY(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c,0.,-s, 0.,1.,0., s,0.,c);
}

mat3 rotX(float a) {
    float c = cos(a), s = sin(a);
    return mat3(1.,0.,0., 0.,c,-s, 0.,s,c);
}

float mapScene(vec3 p, vec4 k) {
    vec3 q = rotY(uTime * 0.22 + k.x * 0.4) * p;

    float d = 9.0;
    vec3 a = vec3(0.1, 0.0, 0.0);
    for (int i = 0; i < 72; i++) {
        a = stepAizawa(a, 0.013, k);
        vec3 c = a * 0.28;
        float fi = float(i);
        c += 0.05 * vec3(sin(fi * 0.6 + uTime), cos(fi * 0.5), sin(fi * 0.4));
        d = min(d, length(q - c) - (0.05 + 0.015 * sin(fi * 0.35 + uTime * 0.8)));
    }
    return d;
}

vec3 normal(vec3 p, vec4 k) {
    vec2 e = vec2(0.002, 0.0);
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
    vec4 k = vec4(0.95 + m.x * 0.07, 0.7, 0.6 + m.y * 0.07, 3.5 + 0.2 * sin(uTime * 0.4));

    vec3 ro = vec3(m.x * 0.6, m.y * 0.4, 2.9);
    vec3 rd = normalize(rotX(-0.35 + m.y * 0.2) * rotY(uTime * 0.28) * vec3(uv, -1.8));

    float t = 0.0;
    float hit = -1.0;
    for (int i = 0; i < 96; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p, k);
        if (d < 0.001) { hit = t; break; }
        t += d * 0.85;
        if (t > 9.5) break;
    }

    vec3 col = mix(vec3(0.01, 0.01, 0.03), vec3(0.03, 0.02, 0.05), vUv.y + 0.2);
    if (hit > 0.0) {
        vec3 p = ro + rd * hit;
        vec3 n = normal(p, k);
        vec3 l = normalize(vec3(-0.55, 0.7, 0.4));
        float diff = max(dot(n, l), 0.0);
        float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.5);
        float spec = pow(max(dot(reflect(-l, n), -rd), 0.0), 22.0);
        vec3 base = mix(vec3(0.15, 0.85, 1.0), vec3(0.95, 0.25, 0.7), p.y * 0.8 + 0.5);
        col = base * (0.2 + 0.8 * diff) + spec * 0.9 + fres * vec3(0.5, 0.75, 1.0);
    }

    vec3 prev = texture(uPrevState, vUv - vec2(0.7 / uResolution.x, 0.0)).rgb;
    col = mix(prev * (0.968 - uDt * 0.04), col, 0.24);

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
    color = pow(color, vec3(0.95, 0.98, 1.02));
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`;
