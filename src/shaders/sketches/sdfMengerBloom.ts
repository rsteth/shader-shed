/**
 * SDF MENGER BLOOM
 * Crystal shell lattice tuned for broader shader compiler compatibility.
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

float sdOcta(vec3 p, float s) {
    p = abs(p);
    return (p.x + p.y + p.z - s) * 0.57735027;
}

vec3 foldSort(vec3 p) {
    // Branch-light coordinate sorting to reduce driver sensitivity.
    p = abs(p);
    float a = max(p.x, p.y);
    float b = min(p.x, p.y);
    float c = max(b, p.z);
    float d = min(b, p.z);
    return vec3(a, c, d);
}

float latticeField(vec3 p) {
    float d = 1e4;
    float scale = 1.0;

    for (int i = 0; i < 4; i++) {
        p = foldSort(p);
        p = p * 2.0 - vec3(1.15, 0.95, 0.85);
        p.yz *= rot(0.45 + float(i) * 0.22 + uTime * 0.06);

        float cell = sdOcta(p, 1.18) / scale;
        d = min(d, cell);
        scale *= 2.0;
    }

    return d;
}

float mapScene(vec3 p) {
    vec3 q = p;
    q.xz *= rot(uTime * 0.22);
    q.yz *= rot(0.3 + sin(uTime * 0.45) * 0.2);

    float lattice = latticeField(q * 0.88);
    float shell = abs(length(q) - 1.55) - 0.2;
    return max(lattice, shell);
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

    vec2 m = (uMouse - 0.5) * vec2(2.6, 1.5);
    vec3 ro = vec3(0.0, 0.15 + m.y * 0.32, 3.7);
    ro.xz *= rot(m.x * 0.42 + uTime * 0.12);

    vec3 ta = vec3(0.0);
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(vec3(0.0, 1.0, 0.0), ww));
    vec3 vv = cross(ww, uu);
    vec3 rd = normalize(uu * uv.x + vv * uv.y + ww * 1.85);

    float t = 0.0;
    float hit = -1.0;

    for (int i = 0; i < 110; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.0012) {
            hit = t;
            break;
        }
        t += d * 0.88;
        if (t > 14.0) break;
    }

    vec3 bg = mix(vec3(0.012, 0.014, 0.032), vec3(0.075, 0.03, 0.11), vUv.y + 0.1);
    vec3 col = bg;

    if (hit > 0.0) {
        vec3 p = ro + rd * hit;
        vec3 n = normal(p);
        vec3 l = normalize(vec3(0.45, 0.82, -0.35));

        float diff = max(dot(n, l), 0.0);
        float spec = pow(max(dot(reflect(-l, n), -rd), 0.0), 24.0);
        float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.8);

        // Avoid re-running latticeField in shading; use cheap animated sparkle signal.
        float sparkle = sin((p.x + p.y + p.z) * 8.0 - uTime * 3.2) * 0.5 + 0.5;
        vec3 base = mix(vec3(0.2, 0.24, 0.72), vec3(0.9, 0.44, 0.8), sparkle);

        col = base * (0.16 + diff * 0.86);
        col += spec * vec3(1.0, 0.95, 1.0);
        col += fres * vec3(0.42, 0.78, 1.0);
        col = mix(bg, col, exp(-hit * 0.1));
    }

    vec2 carry = vec2(1.0 / uResolution.x, 1.0 / uResolution.y) * 0.6;
    vec3 prev = texture(uPrevState, vUv - carry).rgb;
    col = mix(prev * (0.969 - uDt * 0.07), col, 0.22);

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
    color = pow(color, vec3(0.94, 0.96, 0.98));
    color += vec3(0.01, 0.006, 0.015) * (sin(uTime * 0.9 + vUv.x * 12.0) * 0.5 + 0.5);
    color *= smoothstep(0.98, 0.22, distance(vUv, vec2(0.5)));
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`;
