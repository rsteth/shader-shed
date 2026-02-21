/**
 * AIZAWA TWIN ORBIT
 * Two mirrored attractor trails with parallax depth.
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

vec3 aizawa(vec3 p) {
    const float a = 0.95;
    const float b = 0.7;
    const float c = 0.6;
    const float d = 3.5;
    const float e = 0.25;
    const float f = 0.1;
    return vec3(
        (p.z - b) * p.x - d * p.y,
        d * p.x + (p.z - b) * p.y,
        c + a * p.z - (p.z * p.z * p.z) / 3.0 - (p.x * p.x + p.y * p.y) * (1.0 + e * p.z) + f * p.z * p.x * p.x * p.x
    );
}

vec3 stepAizawa(vec3 p, float dt) {
    vec3 k1 = aizawa(p);
    vec3 k2 = aizawa(p + 0.5 * dt * k1);
    vec3 k3 = aizawa(p + 0.5 * dt * k2);
    vec3 k4 = aizawa(p + dt * k3);
    return p + (dt / 6.0) * (k1 + 2.0 * k2 + 2.0 * k3 + k4);
}

mat3 rotY(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c,0.,-s, 0.,1.,0., s,0.,c);
}

void splatThread(vec3 p, bool mirrorX, vec3 tint, mat3 view, vec2 uv, inout vec3 accum, inout float glow) {
    vec3 q = vec3(mirrorX ? -p.x : p.x, p.y, p.z) * 0.24;
    q += vec3(mirrorX ? 0.54 : -0.54, 0.0, 0.0);
    q = view * q;
    float iz = 1.3 / (2.55 + q.z);
    float d = length(uv - q.xy * iz);
    accum += tint * exp(-d * 108.0) * iz;
    glow += exp(-d * 36.0);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec2 m = (uMouse - 0.5) * 2.0;
    mat3 view = rotY(uTime * 0.28 + m.x * 0.6);

    vec3 pA0 = vec3(0.1, 0.02, 0.0);
    vec3 pA1 = vec3(0.13, 0.05, 0.01);
    vec3 pB0 = vec3(-0.11, -0.04, 0.02);
    vec3 pB1 = vec3(0.08, -0.08, 0.03);

    for (int i = 0; i < 120; i++) {
        pA0 = stepAizawa(pA0, 0.01);
        pA1 = stepAizawa(pA1, 0.01);
        pB0 = stepAizawa(pB0, 0.01);
        pB1 = stepAizawa(pB1, 0.01);
    }

    vec3 accum = vec3(0.0);
    float glow = 0.0;

    for (int i = 0; i < 210; i++) {
        pA0 = stepAizawa(pA0, 0.01);
        pA1 = stepAizawa(pA1, 0.01);
        pB0 = stepAizawa(pB0, 0.01);
        pB1 = stepAizawa(pB1, 0.01);

        splatThread(pA0, false, vec3(0.08, 0.78, 1.0), view, uv, accum, glow);
        splatThread(pA1, false, vec3(0.16, 0.9, 1.0), view, uv, accum, glow);
        splatThread(pB0, true, vec3(1.0, 0.33, 0.85), view, uv, accum, glow);
        splatThread(pB1, true, vec3(1.0, 0.5, 0.78), view, uv, accum, glow);
    }

    vec3 bg = mix(vec3(0.01, 0.015, 0.03), vec3(0.03, 0.01, 0.04), vUv.y);
    vec3 col = bg + accum * 0.078 + glow * vec3(0.028, 0.02, 0.05);

    vec3 prev = texture(uPrevState, vUv - vec2(0.75 / uResolution.x, 0.0)).rgb;
    col = mix(prev * (0.964 - uDt * 0.05), col, 0.24);

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
    color = pow(color, vec3(0.92, 0.95, 0.98));
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`;
