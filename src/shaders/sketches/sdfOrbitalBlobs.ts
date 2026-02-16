/**
 * SDF ORBITAL BLOBS
 * Smoothly blended metaball cluster in orbit.
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * h * k * (1.0 / 6.0);
}

float sphere(vec3 p, float r) { return length(p) - r; }

float mapScene(vec3 p) {
    float d = 1e5;
    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float ang = fi * 1.047 + uTime * (0.4 + fi * 0.03);
        vec3 c = vec3(cos(ang), sin(ang * 1.2), sin(ang)) * vec3(0.9, 0.45, 0.9);
        float r = 0.26 + 0.05 * sin(uTime * 2.0 + fi * 1.7);
        d = smin(d, sphere(p - c, r), 0.5);
    }
    d = smin(d, sphere(p, 0.42), 0.6);
    return d;
}

vec3 normal(vec3 p) {
    vec2 e = vec2(0.002, 0.0);
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
    vec3 ro = vec3(m.x * 0.9, m.y * 0.4, 3.2);
    vec3 rd = normalize(vec3(uv, -1.7));

    float t = 0.0;
    float hit = -1.0;
    for (int i = 0; i < 90; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.001) { hit = t; break; }
        t += d * 0.85;
        if (t > 12.0) break;
    }

    vec3 col = mix(vec3(0.01, 0.01, 0.03), vec3(0.08, 0.04, 0.1), vUv.y + 0.2);
    if (hit > 0.0) {
        vec3 p = ro + rd * hit;
        vec3 n = normal(p);
        vec3 l = normalize(vec3(-0.6, 0.75, 0.45));
        float diff = max(dot(n, l), 0.0);
        float spec = pow(max(dot(reflect(-l, n), -rd), 0.0), 24.0);
        float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
        vec3 base = mix(vec3(0.2, 0.55, 0.95), vec3(0.95, 0.25, 0.8), p.y * 0.7 + 0.5);
        col = base * (0.18 + diff * 0.8) + spec * vec3(1.0) * 0.9 + fres * vec3(0.45, 0.85, 1.0);
    }

    vec2 drift = vec2(1.0 / uResolution.x, -1.0 / uResolution.y) * 0.8;
    vec3 prev = texture(uPrevState, vUv - drift).rgb;
    col = mix(prev * (0.97 - uDt * 0.06), col, 0.2);

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
    color = pow(color, vec3(1.05, 1.0, 0.95));
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`;
