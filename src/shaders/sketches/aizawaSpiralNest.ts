/**
 * AIZAWA SPIRAL NEST
 * Perspective orbit of an Aizawa attractor tube.
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

mat3 rotX(float a) {
    float c = cos(a), s = sin(a);
    return mat3(1.,0.,0., 0.,c,-s, 0.,s,c);
}

void splatPoint(vec3 p, mat3 view, vec2 uv, inout float minD, inout float glow, inout float nearZ) {
    vec3 q = view * (p * 0.24);
    float iz = 1.65 / (2.6 + q.z);
    vec2 proj = q.xy * iz;
    float d = length(uv - proj);
    minD = min(minD, d);
    glow += exp(-d * 105.0) * (0.42 + 0.58 * iz);
    nearZ = min(nearZ, q.z + d * 1.8);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec2 m = (uMouse - 0.5) * 2.0;
    float spin = uTime * 0.23;
    mat3 view = rotY(spin + m.x * 0.35) * rotX(0.85 + 0.2 * sin(uTime * 0.35) + m.y * 0.2);

    vec3 p0 = vec3(0.1, 0.02, 0.0);
    vec3 p1 = vec3(-0.12, 0.06, 0.04);
    vec3 p2 = vec3(0.07, -0.09, 0.02);

    for (int i = 0; i < 120; i++) {
        p0 = stepAizawa(p0, 0.01);
        p1 = stepAizawa(p1, 0.01);
        p2 = stepAizawa(p2, 0.01);
    }

    float minD = 9.0;
    float glow = 0.0;
    float nearZ = 99.0;

    for (int i = 0; i < 240; i++) {
        p0 = stepAizawa(p0, 0.01);
        p1 = stepAizawa(p1, 0.01);
        p2 = stepAizawa(p2, 0.01);
        splatPoint(p0, view, uv, minD, glow, nearZ);
        splatPoint(p1, view, uv, minD, glow, nearZ);
        splatPoint(p2, view, uv, minD, glow, nearZ);
    }

    vec3 bg = vec3(0.01, 0.012, 0.03) + 0.03 * vec3(uv.y + 0.2, 0.15, 0.3 + uv.x * 0.1);
    float core = exp(-minD * 170.0);
    vec3 depthTint = mix(vec3(0.25, 0.95, 1.0), vec3(0.92, 0.24, 0.95), clamp((nearZ + 1.2) * 0.42, 0.0, 1.0));
    vec3 col = bg + depthTint * (core * 1.5 + glow * 0.014);

    vec3 prev = texture(uPrevState, vUv).rgb;
    col = mix(prev * 0.969, col, 0.23);

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
    color = pow(color, vec3(0.95));
    fragColor = vec4(color, uOpacity);
}
`;
