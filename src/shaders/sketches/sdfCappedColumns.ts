/**
 * SDF CAPPED COLUMNS
 * Spiral cloister of fluted columns with carved capitals.
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

float sdRoundBox(vec3 p, vec3 b, float r) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float sdCylinder(vec3 p, float r, float h) {
    vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float flutedColumn(vec3 p) {
    float a = atan(p.z, p.x);
    float flute = sin(a * 16.0) * 0.04;
    float shaft = sdCylinder(p, 0.36 + flute, 1.05);
    float capital = sdRoundBox(p - vec3(0.0, 1.18, 0.0), vec3(0.52, 0.12, 0.52), 0.06);
    float base = sdRoundBox(p - vec3(0.0, -1.08, 0.0), vec3(0.48, 0.13, 0.48), 0.05);
    return min(min(shaft, capital), base);
}

float mapScene(vec3 p) {
    vec3 q = p;
    q.y += 0.15 * sin(uTime * 0.5 + p.z * 0.8);

    float corridor = 1e5;
    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float lane = (fi - 2.5) * 1.45;
        vec3 c = q;
        c.z += uTime * 1.1 + fi * 0.7;
        c.z = mod(c.z + 1.8, 3.6) - 1.8;
        c.x -= lane;
        corridor = min(corridor, flutedColumn(c));
    }

    float bridge = sdRoundBox(q - vec3(0.0, 1.55, 0.0), vec3(4.8, 0.14, 2.0), 0.08);
    float floor = q.y + 1.35 + 0.08 * sin(q.x * 2.0 + uTime);

    return min(min(corridor, bridge), floor);
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

    vec2 m = (uMouse - 0.5) * vec2(2.2, 1.4);
    vec3 ro = vec3(m.x * 1.2, 0.25 + m.y * 0.6, 4.2);
    vec3 rd = normalize(vec3(uv.x * 0.9, uv.y * 0.78 - 0.05, -1.45));

    float t = 0.0;
    float hit = -1.0;
    for (int i = 0; i < 104; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.0012) { hit = t; break; }
        t += d * 0.84;
        if (t > 18.0) break;
    }

    vec3 fogCol = vec3(0.02, 0.03, 0.055);
    vec3 col = fogCol + 0.01 / (0.25 + length(uv));

    if (hit > 0.0) {
        vec3 p = ro + rd * hit;
        vec3 n = normal(p);

        vec3 l1 = normalize(vec3(0.45, 0.9, 0.25));
        vec3 l2 = normalize(vec3(-0.35, 0.35, -0.85));
        float diff = max(dot(n, l1), 0.0) + 0.25 * max(dot(n, l2), 0.0);
        float fres = pow(1.0 - max(dot(n, -rd), 0.0), 2.4);

        float grain = fbm(p.xz * 2.6 + vec2(0.0, uTime * 0.05));
        vec3 stone = mix(vec3(0.18, 0.21, 0.29), vec3(0.58, 0.52, 0.46), grain);
        vec3 accents = vec3(0.45, 0.36, 0.25) * smoothstep(0.85, 1.0, sin(atan(p.z, p.x) * 16.0) * 0.5 + 0.5);

        col = (stone + accents * 0.2) * (0.12 + diff * 0.92);
        col += fres * vec3(0.5, 0.65, 0.9) * 0.45;
        col = mix(fogCol, col, exp(-hit * 0.1));
    }

    vec2 adv = vec2(-1.0 / uResolution.x, 1.0 / uResolution.y) * 0.7;
    vec3 prev = texture(uPrevState, vUv + adv).rgb;
    col = mix(prev * (0.972 - uDt * 0.06), col, 0.19);

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
    vec3 color = texture(uTexture, vUv).rgb;
    float vignette = smoothstep(0.98, 0.2, distance(vUv, vec2(0.5, 0.52)));
    color *= vignette;
    color += vec3(0.01, 0.015, 0.025) * (sin(uTime * 0.4) * 0.5 + 0.5);
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`;
