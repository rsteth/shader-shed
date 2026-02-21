/**
 * AIZAWA INK MAP
 * Planar interpretation using contour-like density bands.
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
    vec4 k = vec4(0.95 + m.x * 0.08, 0.7, 0.6 + m.y * 0.1, 3.5);

    vec3 p = vec3(0.15, 0.0, 0.0);
    float stamp = 0.0;
    float ridges = 0.0;

    for (int i = 0; i < 260; i++) {
        vec3 v = flow(p, k);
        p += 0.011 * v;
        vec2 q = p.xy * 0.36;
        float d = length(uv - q);
        stamp += exp(-d * 70.0);
        ridges += exp(-abs(d - 0.08 - 0.02 * sin(float(i) * 0.2 + uTime)) * 180.0);
    }

    float field = stamp * 0.028;
    float contour = smoothstep(0.08, 0.62, field);
    float rings = clamp(ridges * 0.02, 0.0, 1.0);

    vec3 paper = vec3(0.96, 0.93, 0.9) - (0.08 * (vUv.y + vUv.x));
    vec3 ink = mix(vec3(0.08, 0.15, 0.24), vec3(0.2, 0.05, 0.16), rings);
    vec3 col = mix(paper, ink, contour * 0.9);
    col -= rings * 0.18;

    vec3 prev = texture(uPrevState, vUv).rgb;
    col = mix(prev * 0.985, col, 0.14 + uDt * 0.2);

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
    fragColor = vec4(color, uOpacity);
}
`;
