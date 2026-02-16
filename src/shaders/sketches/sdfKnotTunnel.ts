/**
 * SDF KNOT TUNNEL
 * Repeated knot-like ring forms along a tunnel.
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

float mapScene(vec3 p) {
    vec3 q = p;
    q.z += uTime * 2.0;
    q.z = mod(q.z + 1.4, 2.8) - 1.4;

    q.xy *= rot(sin(p.z * 0.8 + uTime) * 0.8);

    float a = sdTorus(q, vec2(0.75, 0.11));
    vec3 r = q;
    r.yz *= rot(1.57);
    float b = sdTorus(r, vec2(0.75, 0.11));

    float knot = min(a, b);
    float shell = abs(length(p.xy) - 1.25) - 0.03;
    return min(knot, shell);
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

    vec2 m = (uMouse - 0.5) * vec2(1.8, 1.0);
    vec3 ro = vec3(m.x * 0.4, m.y * 0.4, 3.0);
    vec3 rd = normalize(vec3(uv * vec2(0.95, 0.8), -1.4));

    float t = 0.0;
    float hit = -1.0;
    for (int i = 0; i < 100; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.001) { hit = t; break; }
        t += d * 0.82;
        if (t > 16.0) break;
    }

    vec3 col = vec3(0.01, 0.015, 0.03) + 0.02 / (0.3 + length(uv));
    if (hit > 0.0) {
        vec3 p = ro + rd * hit;
        vec3 n = normal(p);
        vec3 l = normalize(vec3(-0.5, 0.7, 0.45));
        float diff = max(dot(n, l), 0.0);
        float fres = pow(1.0 - max(dot(n, -rd), 0.0), 4.0);
        vec3 base = mix(vec3(0.12, 0.45, 0.8), vec3(0.85, 0.2, 0.65), sin(p.z * 4.0 + uTime * 3.0) * 0.5 + 0.5);
        col = base * (0.16 + diff * 0.88) + fres * vec3(0.8, 0.95, 1.0);
        col = mix(vec3(0.03, 0.04, 0.06), col, exp(-hit * 0.08));
    }

    vec2 shift = vec2(1.0 / uResolution.x, 0.0) * sin(uTime * 0.5);
    vec3 prev = texture(uPrevState, vUv - shift).rgb;
    col = mix(prev * (0.972 - uDt * 0.06), col, 0.2);

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
    color = color * 1.03 + vec3(0.004, 0.003, 0.008);
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`;
