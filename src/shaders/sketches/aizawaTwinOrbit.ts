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

vec3 field(vec3 p, vec4 k) {
    return vec3(
        (p.z - k.y) * p.x - k.w * p.y,
        k.w * p.x + (p.z - k.y) * p.y,
        k.z + k.x * p.z - (p.z * p.z * p.z) / 3.0 - (p.x * p.x + p.y * p.y) * (1.0 + 0.25 * p.z) + 0.1 * p.z * p.x * p.x * p.x
    );
}

vec3 stepField(vec3 p, float dt, vec4 k) {
    vec3 k1 = field(p, k);
    vec3 k2 = field(p + 0.5 * dt * k1, k);
    return p + dt * k2;
}

mat3 rotY(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c,0.,-s, 0.,1.,0., s,0.,c);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec2 m = (uMouse - 0.5) * 2.0;
    vec3 params = vec3(0.95 + m.x * 0.06, 0.7, 0.62 + m.y * 0.07);
    vec3 k = vec3(params.x, params.y, params.z);
    float d = 3.45 + 0.18 * sin(uTime * 0.5);

    mat3 view = rotY(uTime * 0.3 + m.x * 0.5);
    vec3 pA = vec3(0.1, 0.0, 0.0);
    vec3 pB = vec3(-0.08, 0.15, 0.05);

    vec3 accum = vec3(0.0);
    float glow = 0.0;

    for (int i = 0; i < 190; i++) {
        pA = stepField(pA, 0.013, vec4(k.x, k.y, k.z, d));
        pB = stepField(pB, 0.0135, vec4(k.x + 0.02, k.y, k.z - 0.01, d));

        vec3 qA = view * (pA * 0.24 + vec3(-0.55, 0.0, 0.0));
        vec3 qB = view * vec3(-pB.x * 0.24 + 0.55, pB.y * 0.24, pB.z * 0.24);

        float izA = 1.3 / (2.5 + qA.z);
        float izB = 1.3 / (2.5 + qB.z);

        float dA = length(uv - qA.xy * izA);
        float dB = length(uv - qB.xy * izB);

        accum += vec3(0.1, 0.75, 1.0) * exp(-dA * 100.0) * izA;
        accum += vec3(1.0, 0.35, 0.85) * exp(-dB * 100.0) * izB;
        glow += exp(-min(dA, dB) * 34.0);
    }

    vec3 bg = mix(vec3(0.01, 0.015, 0.03), vec3(0.03, 0.01, 0.04), vUv.y);
    vec3 col = bg + accum * 0.12 + glow * vec3(0.05, 0.03, 0.08);

    vec2 smear = vec2(0.8 / uResolution.x, 0.0);
    vec3 prev = texture(uPrevState, vUv - smear).rgb;
    col = mix(prev * (0.96 - uDt * 0.05), col, 0.22);

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
