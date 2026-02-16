/**
 * SDF GYROID PULSE
 * Gyroid-like labyrinth carved by an oscillating shell.
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
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}

float gyroid(vec3 p) {
    return dot(sin(p), cos(p.zxy));
}

float mapScene(vec3 p) {
    vec3 q = p;
    q.xz *= rot(uTime * 0.25);
    float shell = abs(length(q) - 1.35) - 0.18;
    float maze = abs(gyroid(q * 3.4 + uTime * 0.35)) / 3.4 - 0.05;
    return max(shell, -maze);
}

vec3 render(vec3 ro, vec3 rd) {
    float t = 0.0;
    float h = -1.0;

    for (int i = 0; i < 100; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.001) {
            h = t;
            break;
        }
        t += d * 0.9;
        if (t > 14.0) break;
    }

    vec3 bg = mix(vec3(0.015, 0.02, 0.04), vec3(0.09, 0.16, 0.25), rd.y * 0.5 + 0.5);
    if (h < 0.0) return bg;

    vec3 p = ro + rd * h;
    vec2 e = vec2(0.002, 0.0);
    vec3 n = normalize(vec3(
        mapScene(p + e.xyy) - mapScene(p - e.xyy),
        mapScene(p + e.yxy) - mapScene(p - e.yxy),
        mapScene(p + e.yyx) - mapScene(p - e.yyx)
    ));

    vec3 l1 = normalize(vec3(0.6, 0.8, 0.2));
    vec3 l2 = normalize(vec3(-0.4, 0.3, -0.9));
    float diff = max(dot(n, l1), 0.0) + max(dot(n, l2), 0.0) * 0.35;
    float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.5);

    float pulse = sin(7.0 * gyroid(p * 2.2) + uTime * 2.0) * 0.5 + 0.5;
    vec3 base = mix(vec3(0.1, 0.5, 0.5), vec3(0.8, 0.9, 0.35), pulse);

    return base * (0.12 + diff) + fres * vec3(0.55, 0.9, 1.0);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec2 m = (uMouse - 0.5) * vec2(3.1415, 1.4);
    vec3 ro = vec3(0.0, 0.0, 3.3);
    ro.xz *= rot(m.x * 0.35);
    ro.y += m.y * 0.3;
    vec3 rd = normalize(vec3(uv, -1.6));

    vec3 col = render(ro, rd);
    vec3 prev = texture(uPrevState, vUv).rgb;
    col = mix(prev * (0.965 - uDt * 0.08), col, 0.2);

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
    color = smoothstep(0.0, 1.0, color);
    fragColor = vec4(color, uOpacity);
}
`;
