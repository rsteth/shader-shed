/**
 * SDF CAPPED COLUMNS
 * Reimagined as a spiraling colonnade with floating ring bridges.
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

float sdCappedCylinder(vec3 p, float h, float r) {
    vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

float mapScene(vec3 p) {
    vec3 q = p;
    q.y += 0.4;

    // Spiral columns around the center axis.
    float floorId = floor((q.y + 1.5) / 0.9);
    float twist = floorId * 0.38 + uTime * 0.28;
    q.xz *= rot(twist);

    float a = atan(q.z, q.x);
    float ringRadius = 1.35 + 0.12 * sin(floorId * 1.7 + uTime * 0.9);
    vec2 ring = vec2(cos(a), sin(a)) * ringRadius;

    vec3 local = q;
    local.xz -= ring;
    float column = sdCappedCylinder(local, 0.45, 0.16);

    // Ornamental caps.
    float topCap = length(local - vec3(0.0, 0.47, 0.0)) - 0.2;
    float bottomCap = length(local - vec3(0.0, -0.47, 0.0)) - 0.18;

    // Floating bridge rings between column layers.
    vec3 bridge = q;
    bridge.y = mod(bridge.y + 0.45, 0.9) - 0.45;
    float bridgeRing = sdTorus(bridge, vec2(1.35, 0.05));

    // Thin central core for silhouette structure.
    float core = sdCappedCylinder(p, 2.8, 0.09);

    return min(min(min(column, topCap), bottomCap), min(bridgeRing, core));
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

    vec2 m = (uMouse - 0.5) * vec2(2.0, 1.2);
    vec3 ro = vec3(2.0 * sin(uTime * 0.17 + m.x), m.y * 0.9, 2.0 * cos(uTime * 0.17 + m.x));
    vec3 ta = vec3(0.0, 0.2, 0.0);

    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(vec3(0.0, 1.0, 0.0), ww));
    vec3 vv = cross(ww, uu);
    vec3 rd = normalize(uu * uv.x + vv * uv.y + ww * 1.8);

    float t = 0.0;
    float hit = -1.0;
    for (int i = 0; i < 110; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.001) { hit = t; break; }
        t += d * 0.82;
        if (t > 16.0) break;
    }

    vec3 fogCol = vec3(0.02, 0.025, 0.05);
    vec3 col = fogCol + vec3(0.02, 0.015, 0.04) / (0.3 + length(uv));

    if (hit > 0.0) {
        vec3 p = ro + rd * hit;
        vec3 n = normal(p);
        vec3 l1 = normalize(vec3(0.4, 0.85, 0.3));
        vec3 l2 = normalize(vec3(-0.6, 0.4, -0.5));

        float diff = max(dot(n, l1), 0.0) + 0.35 * max(dot(n, l2), 0.0);
        float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);

        float band = sin((p.y + atan(p.z, p.x)) * 6.0 + uTime * 1.4) * 0.5 + 0.5;
        vec3 stone = mix(vec3(0.18, 0.2, 0.28), vec3(0.62, 0.54, 0.42), band);

        col = stone * (0.14 + diff * 0.82) + fres * vec3(0.65, 0.78, 0.95) * 0.65;
        col = mix(fogCol, col, exp(-hit * 0.1));
    }

    vec2 drift = vec2(1.0 / uResolution.x, -1.0 / uResolution.y) * 0.45;
    vec3 prev = texture(uPrevState, vUv - drift).rgb;
    col = mix(prev * (0.973 - uDt * 0.06), col, 0.2);

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
    float glow = sin((vUv.y + uTime * 0.08) * 220.0) * 0.5 + 0.5;
    color += vec3(0.012, 0.01, 0.02) * glow;
    color *= smoothstep(0.97, 0.2, distance(vUv, vec2(0.5)));
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`;
