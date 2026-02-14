/**
 * FURNACE MIRE SKETCH
 * Alternative interpretation from first principles:
 * - Build a scalar potential field from rotating radial waves.
 * - Curl its gradient into a pseudo-velocity to swirl a ray.
 * - Accumulate heat and ash via blackbody-inspired palette mapping.
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform float uTime;
uniform vec2 uResolution;

mat2 rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

float potential(vec2 p, float t) {
    vec2 q = p;
    float f = 0.0;
    float amp = 0.65;

    for (int k = 0; k < 5; k++) {
        float phase = t * (0.24 + float(k) * 0.11);
        q = rot(phase) * q * 1.31 + vec2(0.45, -0.28);

        float r = length(q);
        float ang = atan(q.y, q.x);
        f += amp * sin(3.0 * ang + r * (3.8 + float(k)) - phase * 2.1);
        amp *= 0.56;
    }

    return f;
}

vec2 curlFlow(vec2 p, float t) {
    float e = 0.01;
    float px1 = potential(p + vec2(e, 0.0), t);
    float px2 = potential(p - vec2(e, 0.0), t);
    float py1 = potential(p + vec2(0.0, e), t);
    float py2 = potential(p - vec2(0.0, e), t);

    vec2 grad = vec2(px1 - px2, py1 - py2) / (2.0 * e);
    return vec2(-grad.y, grad.x);
}

vec3 blackbodyRamp(float x) {
    vec3 ember = vec3(0.22, 0.02, 0.01);
    vec3 fire = vec3(0.95, 0.24, 0.04);
    vec3 flare = vec3(1.1, 0.82, 0.2);
    vec3 smoke = vec3(0.12, 0.12, 0.16);

    vec3 c = mix(ember, fire, smoothstep(0.0, 0.42, x));
    c = mix(c, flare, smoothstep(0.35, 0.95, x));
    c = mix(c, smoke, smoothstep(0.9, 1.3, x));
    return c;
}

void main() {
    vec2 uv = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    float t = uTime;

    vec2 p = uv;
    float heat = 0.0;
    float ash = 0.0;

    for (int i = 0; i < 72; i++) {
        float fi = float(i);
        float depth = fi / 72.0;

        vec2 flow = curlFlow(p * (1.2 + depth * 2.1), t + depth * 1.6);
        p += 0.026 * flow;

        float cell = potential(p * (2.3 + depth * 3.4), t * 0.9 - depth * 2.5);
        float ridge = exp(-5.0 * abs(cell));
        float pockets = smoothstep(0.42, 1.3, cell + 0.55 * sin(depth * 17.0 - t));

        heat += ridge * (1.0 - depth) * 0.043;
        ash += pockets * depth * 0.028;

        p += 0.002 * vec2(sin(fi + t * 0.7), cos(fi * 1.3 - t * 0.5));
    }

    float luminance = heat * 1.9 + ash * 0.4;
    vec3 color = blackbodyRamp(luminance);

    float vignette = smoothstep(1.2, 0.2, length(uv));
    color *= vignette;

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
