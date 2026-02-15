/**
 * PILLARS OF CREATION - ORGANIC TRUNKS
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform float uTime;
uniform vec2 uResolution;

float hash(float n) { return fract(sin(n) * 43758.5453); }

float valueNoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = dot(i, vec3(1.0, 57.0, 113.0));
    float x1 = mix(hash(n), hash(n + 1.0), f.x);
    float x2 = mix(hash(n + 57.0), hash(n + 58.0), f.x);
    float x3 = mix(hash(n + 113.0), hash(n + 114.0), f.x);
    float x4 = mix(hash(n + 170.0), hash(n + 171.0), f.x);
    return mix(mix(x1, x2, f.y), mix(x3, x4, f.y), f.z);
}

float fbm3(vec3 p) {
    float a = 0.5;
    float v = 0.0;
    for (int i = 0; i < 4; i++) {
        v += a * valueNoise(p);
        p *= 2.02;
        a *= 0.5;
    }
    return v;
}

vec3 hubblePalette(float sulfur, float hydrogen, float oxygen) {
    return sulfur * vec3(1.2, 0.25, 0.08)
         + hydrogen * vec3(0.15, 1.1, 0.25)
         + oxygen * vec3(0.08, 0.35, 1.2);
}

float densityField(vec3 p) {
    vec3 warp = vec3(
        fbm3(p * 0.35 + 13.1),
        fbm3(p * 0.35 - 7.2),
        fbm3(p * 0.35 + 2.7)
    );
    vec3 wp = p + 0.85 * (warp - 0.5);

    float baseNoise = fbm3(vec3(wp.x * 0.55, wp.y * 0.12, wp.z * 0.55));
    float ridge = 1.0 - abs(2.0 * baseNoise - 1.0);
    float pillarMask = smoothstep(0.35, 0.85, ridge) * smoothstep(-0.2, 1.6, wp.y);
    float erosion = fbm3(wp * 1.35);
    return max(0.0, pillarMask * (0.9 - 0.78 * erosion));
}

void main() {
    vec2 fc = vUv * uResolution;
    vec2 r = uResolution;
    float t = uTime;
    vec2 uv = (fc - 0.5 * r) / r.y;

    vec3 ro = vec3(0.0, 0.2, -3.2) + vec3(0.15 * sin(t * 0.05), 0.05 * sin(t * 0.03), t * 0.05);
    vec3 rd = normalize(vec3(uv, 1.25));

    vec3 color = vec3(0.0);
    float tr = 1.0;
    float ray = 0.0;
    const float maxSteps = 88.0;
    const float stepSize = 0.06;

    for (float i = 0.0; i < maxSteps; i++) {
        vec3 p = ro + rd * ray;
        float density = densityField(p);

        float sulfur = density * smoothstep(0.2, 0.9, fbm3(p * 0.8));
        float hydrogen = density * smoothstep(-0.1, 1.4, p.y);
        float oxygen = density * smoothstep(0.3, 0.85, fbm3(p * 1.7 + 5.0));

        color += tr * hubblePalette(sulfur, hydrogen, oxygen) * stepSize;
        tr *= exp(-density * 2.35 * stepSize);
        if (tr < 0.02) { break; }
        ray += stepSize;
    }

    fragColor = vec4(color, 1.0);
}
`;

export const final = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uOpacity;

void main() {
    vec4 tex = texture(uTexture, vUv);
    fragColor = vec4(tex.rgb, uOpacity);
}
`;
