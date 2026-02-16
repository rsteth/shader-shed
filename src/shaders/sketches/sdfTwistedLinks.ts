/**
 * SDF TWISTED LINKS
 * Raymarched torus links with a gentle feedback trail.
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}

float mapScene(vec3 p) {
    vec3 q = p;
    q.xz *= rot(0.6 * q.y + uTime * 0.35);

    float d = 1e5;
    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        vec3 r = q;
        r.xz *= rot(fi * 2.094 + uTime * 0.2);
        r.x -= 0.85;
        d = min(d, sdTorus(r, vec2(0.36, 0.12)));
    }

    float core = length(q) - 0.33;
    return min(d, core);
}

vec3 shade(vec3 ro, vec3 rd) {
    float t = 0.0;
    float hit = -1.0;

    for (int i = 0; i < 96; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.001) {
            hit = t;
            break;
        }
        t += d * 0.75;
        if (t > 12.0) break;
    }

    vec3 sky = mix(vec3(0.02, 0.03, 0.07), vec3(0.08, 0.11, 0.2), rd.y * 0.5 + 0.5);
    if (hit < 0.0) return sky;

    vec3 p = ro + rd * hit;
    vec2 e = vec2(0.002, 0.0);
    vec3 n = normalize(vec3(
        mapScene(p + e.xyy) - mapScene(p - e.xyy),
        mapScene(p + e.yxy) - mapScene(p - e.yxy),
        mapScene(p + e.yyx) - mapScene(p - e.yyx)
    ));

    vec3 l = normalize(vec3(-0.4, 0.8, 0.35));
    float diff = max(dot(n, l), 0.0);
    float rim = pow(1.0 - max(dot(n, -rd), 0.0), 2.4);

    vec3 base = mix(vec3(0.2, 0.15, 0.5), vec3(0.8, 0.35, 0.55), sin(p.y * 5.0 + uTime) * 0.5 + 0.5);
    return base * (0.18 + diff * 0.82) + rim * vec3(0.6, 0.45, 0.9) + sky * 0.15;
}

void main() {
    vec2 uv = (vUv * 2.0 - 1.0);
    uv.x *= uResolution.x / uResolution.y;

    vec2 mouse = (uMouse - 0.5) * vec2(2.4, 1.8);
    vec3 ro = vec3(0.0 + mouse.x * 0.15, 0.0 + mouse.y * 0.15, 3.6);
    vec3 ta = vec3(0.0);

    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(vec3(0.0, 1.0, 0.0), ww));
    vec3 vv = cross(ww, uu);
    vec3 rd = normalize(uu * uv.x + vv * uv.y + ww * 1.7);

    vec3 color = shade(ro, rd);

    vec2 px = 1.0 / uResolution;
    vec3 prev = texture(uPrevState, vUv - vec2(px.x, 0.0) * 0.6).rgb;
    color = mix(prev * (0.97 - uDt * 0.08), color, 0.18);

    fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
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
    color = pow(color, vec3(0.92));
    color += (sin((vUv.y + uTime * 0.08) * 420.0) * 0.5 + 0.5) * 0.01;
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`;
