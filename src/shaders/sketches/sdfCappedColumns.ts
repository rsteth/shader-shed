/**
 * SDF CAPPED COLUMNS
 * Repeated rounded columns and arches.
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

float sdRoundedCylinder(vec3 p, float ra, float rb, float h) {
    vec2 d = vec2(length(p.xz) - 2.0 * ra + rb, abs(p.y) - h);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - rb;
}

float sdArch(vec3 p) {
    vec3 q = p;
    q.y -= 0.7;
    float outer = length(vec2(length(q.xz) - 0.9, q.y)) - 0.17;
    float inner = length(vec2(length(q.xz) - 0.55, q.y)) - 0.15;
    return max(outer, -inner);
}

float mapScene(vec3 p) {
    vec3 q = p;
    q.z += uTime * 1.4;
    q.x = mod(q.x + 1.5, 3.0) - 1.5;
    q.z = mod(q.z + 2.0, 4.0) - 2.0;

    float col = sdRoundedCylinder(q, 0.38, 0.08, 1.0);
    float cap = length(q - vec3(0.0, 1.08, 0.0)) - 0.28;
    float arch = sdArch(q);

    return min(min(col, cap), arch);
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

    vec2 m = (uMouse - 0.5) * vec2(1.5, 0.9);
    vec3 ro = vec3(m.x, 0.2 + m.y, 3.2);
    vec3 rd = normalize(vec3(uv.x * 0.95, uv.y * 0.8 - 0.05, -1.5));

    float t = 0.0;
    float hit = -1.0;
    for (int i = 0; i < 96; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.001) { hit = t; break; }
        t += d * 0.85;
        if (t > 14.0) break;
    }

    vec3 fogCol = vec3(0.03, 0.035, 0.07);
    vec3 col = fogCol;

    if (hit > 0.0) {
        vec3 p = ro + rd * hit;
        vec3 n = normal(p);
        vec3 l = normalize(vec3(0.35, 0.85, 0.2));
        float diff = max(dot(n, l), 0.0);
        float ao = clamp(1.0 - hit / 11.0, 0.0, 1.0);
        vec3 stone = mix(vec3(0.2, 0.22, 0.3), vec3(0.5, 0.45, 0.4), fbm(p.xz * 1.7 + uTime * 0.1));
        col = stone * (0.12 + diff * 0.9) * ao;
        col = mix(fogCol, col, exp(-hit * 0.12));
    }

    vec3 prev = texture(uPrevState, vUv + vec2(0.0, -1.0 / uResolution.y) * 0.4).rgb;
    col = mix(prev * (0.973 - uDt * 0.05), col, 0.18);

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
    float vig = smoothstep(0.98, 0.2, distance(vUv, vec2(0.5)));
    color *= vig;
    fragColor = vec4(color, uOpacity);
}
`;
