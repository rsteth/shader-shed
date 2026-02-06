/**
 * PLASMA SKETCH
 * Classic demoscene plasma with layered sine waves
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

void main() {
    vec2 st = vUv;
    float t = uTime * 0.5;

    // Classic plasma: sum of sine waves at different frequencies
    float v = 0.0;

    // Layer 1: horizontal waves
    v += sin(st.x * 10.0 + t);

    // Layer 2: vertical waves
    v += sin(st.y * 10.0 + t * 0.8);

    // Layer 3: diagonal
    v += sin((st.x + st.y) * 10.0 + t * 0.6);

    // Layer 4: radial from center
    float cx = st.x - 0.5;
    float cy = st.y - 0.5;
    v += sin(sqrt(cx * cx + cy * cy) * 20.0 - t * 2.0);

    // Layer 5: radial from mouse
    float mx = st.x - uMouse.x;
    float my = st.y - uMouse.y;
    v += sin(sqrt(mx * mx + my * my) * 15.0 - t * 3.0) * 0.5;

    // Normalize to 0-1
    v = (v + 5.0) / 10.0;

    // Map to colors using sine for smooth cycling
    vec3 color;
    color.r = sin(v * 3.14159 * 2.0) * 0.5 + 0.5;
    color.g = sin(v * 3.14159 * 2.0 + 2.094) * 0.5 + 0.5;
    color.b = sin(v * 3.14159 * 2.0 + 4.188) * 0.5 + 0.5;

    fragColor = vec4(color, 1.0);
}
`;

export const final = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uOpacity;

void main() {
    vec4 tex = texture(uTexture, vUv);
    vec3 color = tex.rgb;

    // Slight contrast boost
    color = pow(color, vec3(0.9));

    // Soft vignette
    float dist = distance(vUv, vec2(0.5));
    color *= smoothstep(0.9, 0.3, dist);

    fragColor = vec4(color, uOpacity);
}
`;
