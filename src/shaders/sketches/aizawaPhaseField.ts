/**
 * AIZAWA PHASE FIELD
 * Flattened phase portrait with woven interference bands.
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

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec2 m = (uMouse - 0.5) * 2.0;
    vec3 p = vec3(0.1, 0.0, m.y * 0.02);
    float nearest = 10.0;
    float weave = 0.0;

    for (int i = 0; i < 280; i++) {
        p = stepAizawa(p, 0.0098);
        vec2 plane = vec2(p.x, p.z) * 0.31 + vec2(m.x * 0.03, 0.0);
        float d = length(uv - plane);
        nearest = min(nearest, d);
        weave += sin((plane.x + plane.y) * 28.0 + float(i) * 0.24) * exp(-d * 46.0);
    }

    float lines = exp(-nearest * 132.0);
    float lattice = 0.5 + 0.5 * sin(weave * 1.4 + uv.x * 18.0 - uTime * 0.6);

    vec3 bg = mix(vec3(0.05, 0.06, 0.09), vec3(0.01, 0.01, 0.03), length(uv) * 0.7);
    vec3 toneA = vec3(0.3, 0.85, 0.95);
    vec3 toneB = vec3(0.95, 0.42, 0.3);
    vec3 col = bg + mix(toneA, toneB, lattice) * lines;
    col += lines * 0.2 * vec3(lattice * 0.4, 0.2, 1.0 - lattice);

    vec2 trail = vec2(0.6 / uResolution.x, -0.3 / uResolution.y);
    vec3 prev = texture(uPrevState, vUv - trail).rgb;
    col = mix(prev * 0.973, col, 0.215);

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
    color = clamp(color, 0.0, 1.0);
    fragColor = vec4(color, uOpacity);
}
`;
