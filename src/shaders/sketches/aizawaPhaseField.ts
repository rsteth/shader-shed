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

vec3 flow(vec3 p, vec4 k) {
    return vec3(
        (p.z - k.y) * p.x - k.w * p.y,
        k.w * p.x + (p.z - k.y) * p.y,
        k.z + k.x * p.z - (p.z * p.z * p.z) / 3.0 - (p.x * p.x + p.y * p.y) * (1.0 + 0.25 * p.z) + 0.1 * p.z * p.x * p.x * p.x
    );
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec2 m = (uMouse - 0.5) * 2.0;
    vec4 k = vec4(0.95 + 0.04 * sin(uTime * 0.3), 0.7, 0.6 + m.y * 0.05, 3.45 + m.x * 0.3);

    vec3 p = vec3(0.1, 0.0, 0.0);
    float nearest = 10.0;
    float weave = 0.0;

    for (int i = 0; i < 240; i++) {
        vec3 v = flow(p, k);
        p += 0.0125 * v;
        vec2 plane = vec2(p.x, p.z) * 0.32;
        float d = length(uv - plane);
        nearest = min(nearest, d);
        weave += sin((plane.x + plane.y) * 28.0 + float(i) * 0.25) * exp(-d * 45.0);
    }

    float lines = exp(-nearest * 130.0);
    float lattice = 0.5 + 0.5 * sin(weave * 1.4 + uv.x * 18.0 - uTime * 0.6);

    vec3 bg = mix(vec3(0.05, 0.06, 0.09), vec3(0.01, 0.01, 0.03), length(uv) * 0.7);
    vec3 toneA = vec3(0.3, 0.85, 0.95);
    vec3 toneB = vec3(0.95, 0.42, 0.3);
    vec3 col = bg + mix(toneA, toneB, lattice) * lines;
    col += lines * 0.2 * vec3(lattice * 0.4, 0.2, 1.0 - lattice);

    vec2 trail = vec2(0.6 / uResolution.x, -0.3 / uResolution.y);
    vec3 prev = texture(uPrevState, vUv - trail).rgb;
    col = mix(prev * 0.972, col, 0.21);

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
