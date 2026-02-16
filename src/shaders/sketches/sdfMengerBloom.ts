/**
 * SDF MENGER BLOOM
 * Fractal-ish box lattice with emissive cavities.
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

float menger(vec3 p) {
    float d = sdBox(p, vec3(1.0));
    float scale = 1.0;
    for (int i = 0; i < 4; i++) {
        p = abs(p);
        if (p.x < p.y) p.xy = p.yx;
        if (p.x < p.z) p.xz = p.zx;
        if (p.y < p.z) p.yz = p.zy;
        p = p * 3.0 - vec3(2.0) * 2.0;
        scale *= 3.0;
        float c = sdBox(p, vec3(1.0, 0.25, 0.25)) / scale;
        d = max(d, -c);
    }
    return d;
}

float mapScene(vec3 p) {
    p.xz *= rot(uTime * 0.2);
    p.yz *= rot(0.4 + sin(uTime * 0.3) * 0.2);
    return menger(p * 0.8);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec3 ro = vec3(0.0, 0.0, 4.0);
    vec2 m = (uMouse - 0.5) * vec2(2.2, 1.2);
    ro.xz *= rot(m.x * 0.4);
    ro.y += m.y * 0.8;

    vec3 rd = normalize(vec3(uv, -1.9));
    float t = 0.0;
    float hit = -1.0;

    for (int i = 0; i < 120; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.0012) {
            hit = t;
            break;
        }
        t += d * 0.9;
        if (t > 14.0) break;
    }

    vec3 bg = mix(vec3(0.01, 0.015, 0.03), vec3(0.08, 0.05, 0.15), vUv.y);
    vec3 col = bg;

    if (hit > 0.0) {
        vec3 p = ro + rd * hit;
        vec2 e = vec2(0.003, 0.0);
        vec3 n = normalize(vec3(
            mapScene(p + e.xyy) - mapScene(p - e.xyy),
            mapScene(p + e.yxy) - mapScene(p - e.yxy),
            mapScene(p + e.yyx) - mapScene(p - e.yyx)
        ));

        vec3 l = normalize(vec3(0.4, 0.9, -0.2));
        float diff = max(dot(n, l), 0.0);
        float cavity = smoothstep(0.02, 0.0, abs(mapScene(p + n * 0.04)));
        vec3 base = mix(vec3(0.35, 0.2, 0.65), vec3(0.95, 0.7, 0.35), p.y * 0.4 + 0.5);
        col = base * (0.2 + diff * 0.9) + cavity * vec3(0.9, 0.25, 0.6);
    }

    vec3 prev = texture(uPrevState, vUv + vec2(0.0, 1.0 / uResolution.y) * 0.7).rgb;
    col = mix(prev * (0.968 - uDt * 0.08), col, 0.22);

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
    float vig = smoothstep(0.95, 0.25, distance(vUv, vec2(0.5)));
    color *= vig;
    color += vec3(0.01, 0.005, 0.02) * sin(uTime * 0.7);
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`;
