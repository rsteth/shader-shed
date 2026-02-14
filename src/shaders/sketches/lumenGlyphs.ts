/**
 * LUMEN GLYPHS SKETCH
 * Floating neon symbols carved by thresholded harmonic fields.
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

float glyph(vec2 p, float scale, float phase) {
    vec2 q = p * scale;
    float a = sin(q.x + phase);
    float b = sin(q.y * 1.7 - phase * 0.7);
    float c = sin((q.x + q.y) * 0.9 + phase * 1.2);
    return smoothstep(1.25, 1.45, a + b + c);
}

void main() {
    vec2 st = vUv;
    vec2 pixel = 1.0 / uResolution;
    float t = uTime;

    vec2 p = (st - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    vec2 wobble = vec2(
        fbm(st * 4.0 + vec2(t * 0.2, 0.0)) - 0.5,
        fbm(st * 4.0 + vec2(11.0, -t * 0.18)) - 0.5
    );

    float g1 = glyph(p + wobble * 0.22, 11.0, t * 1.1);
    float g2 = glyph(p.yx + wobble * 0.18, 8.0, -t * 0.8);
    float sigil = clamp(g1 + g2, 0.0, 1.0);

    float mouseCharge = smoothstep(0.22, 0.0, distance(st, uMouse));
    vec3 glyphColor = mix(vec3(0.05, 0.04, 0.1), vec3(0.35, 0.95, 0.85), sigil);
    glyphColor += mouseCharge * vec3(0.5, 0.2, 0.7);

    vec2 advection = vec2(wobble.y, -wobble.x) * pixel * 10.0;
    vec3 prev = texture(uPrevState, st - advection).rgb * (0.974 - 0.18 * uDt);

    vec3 color = mix(prev, glyphColor, 0.08 + 0.2 * sigil);
    fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
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

    float scan = 0.97 + 0.03 * sin(vUv.y * 900.0 + uTime * 8.0);
    color *= scan;
    color = clamp(color, 0.0, 1.0);

    fragColor = vec4(color, uOpacity);
}
`;
