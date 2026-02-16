/**
 * SDF MENGER BLOOM
 * Kaleidoscopic box-fold fractal with emissive seams.
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

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float boxFoldFractal(vec3 p) {
    vec3 z = p;
    float scale = 1.0;
    float d = 1e5;

    for (int i = 0; i < 6; i++) {
        z = clamp(z, -1.0, 1.0) * 2.0 - z;
        float r2 = dot(z, z);
        float k = clamp(1.35 / r2, 0.45, 2.2);
        z *= k;
        z += vec3(-0.16, 0.1, 0.14);
        z.xy *= rot(0.45 + 0.08 * float(i) + uTime * 0.08);
        z.yz *= rot(0.25 + uTime * 0.05);
        scale *= k;

        float cut = sdBox(z, vec3(0.58, 0.22, 0.22)) / scale;
        d = min(d, cut);
    }

    float shell = (length(z) - 0.33) / scale;
    return max(d, shell);
}

float mapScene(vec3 p) {
    vec3 q = p;
    q.xz *= rot(uTime * 0.22);
    q.xy *= rot(0.35 + sin(uTime * 0.17) * 0.35);
    return boxFoldFractal(q * 0.95);
}

vec3 normal(vec3 p) {
    vec2 e = vec2(0.0025, 0.0);
    return normalize(vec3(
        mapScene(p + e.xyy) - mapScene(p - e.xyy),
        mapScene(p + e.yxy) - mapScene(p - e.yxy),
        mapScene(p + e.yyx) - mapScene(p - e.yyx)
    ));
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec2 m = (uMouse - 0.5) * vec2(2.5, 1.6);
    vec3 ro = vec3(0.0, 0.0, 4.0);
    ro.xz *= rot(m.x * 0.45);
    ro.y += m.y * 0.7;

    vec3 ww = normalize(-ro);
    vec3 uu = normalize(cross(vec3(0.0, 1.0, 0.0), ww));
    vec3 vv = cross(ww, uu);
    vec3 rd = normalize(uu * uv.x + vv * uv.y + ww * 1.9);

    float t = 0.0;
    float hit = -1.0;
    for (int i = 0; i < 128; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.001) { hit = t; break; }
        t += d * 0.88;
        if (t > 15.0) break;
    }

    vec3 bg = mix(vec3(0.008, 0.01, 0.03), vec3(0.07, 0.03, 0.12), rd.y * 0.5 + 0.5);
    vec3 col = bg;

    if (hit > 0.0) {
        vec3 p = ro + rd * hit;
        vec3 n = normal(p);
        vec3 l = normalize(vec3(0.55, 0.8, 0.1));

        float diff = max(dot(n, l), 0.0);
        float spec = pow(max(dot(reflect(-l, n), -rd), 0.0), 28.0);
        float fres = pow(1.0 - max(dot(n, -rd), 0.0), 4.0);

        float seam = smoothstep(0.02, 0.0, abs(mapScene(p + n * 0.025)));
        vec3 base = mix(vec3(0.24, 0.18, 0.62), vec3(0.95, 0.6, 0.3), sin(p.y * 2.8 + uTime * 0.8) * 0.5 + 0.5);
        vec3 emissive = vec3(0.95, 0.3, 0.75) * seam;

        col = base * (0.12 + diff * 0.95) + spec * vec3(1.0) * 0.8;
        col += emissive * (0.45 + 0.55 * sin(uTime * 2.2 + p.x * 5.0));
        col += fres * vec3(0.6, 0.8, 1.0);
        col = mix(bg, col, exp(-hit * 0.14));
    }

    vec2 trail = vec2(1.0 / uResolution.x, 0.0) * (0.6 + 0.4 * sin(uTime * 0.6));
    vec3 prev = texture(uPrevState, vUv - trail).rgb;
    col = mix(prev * (0.968 - uDt * 0.07), col, 0.22);

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
    color = pow(color, vec3(0.95));
    float pulse = sin(uTime * 0.9) * 0.5 + 0.5;
    color += vec3(0.02, 0.006, 0.018) * pulse;
    color *= smoothstep(0.97, 0.23, distance(vUv, vec2(0.5)));
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`;
