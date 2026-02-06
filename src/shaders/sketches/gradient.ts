/**
 * GRADIENT DRIFT SKETCH
 * Smooth flowing color gradients with feedback
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

// Rotate a 2D vector
vec2 rotate(vec2 v, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

void main() {
    vec2 st = vUv;
    vec2 pixel = 1.0 / uResolution;
    float t = uTime * 0.3;

    // Generate flowing gradient based on noise
    float n1 = fbm(st * 2.0 + t * 0.2);
    float n2 = fbm(st * 2.0 - t * 0.15 + 100.0);
    float n3 = fbm(st * 3.0 + vec2(t * 0.1, -t * 0.12));

    // Color palette using smooth interpolation
    vec3 c1 = vec3(0.1, 0.2, 0.5);  // Deep blue
    vec3 c2 = vec3(0.4, 0.1, 0.5);  // Purple
    vec3 c3 = vec3(0.1, 0.4, 0.4);  // Teal
    vec3 c4 = vec3(0.5, 0.2, 0.3);  // Mauve

    // Mix colors based on noise
    vec3 color = mix(c1, c2, n1);
    color = mix(color, c3, n2);
    color = mix(color, c4, n3 * 0.5);

    // Read previous frame with slight offset for trails
    vec2 flowDir = rotate(vec2(1.0, 0.0), n1 * 6.28);
    vec4 prev = texture(uPrevState, st - flowDir * pixel * 1.5);

    // Blend with previous for smooth trails
    color = mix(prev.rgb * 0.95, color, 0.15);

    // Mouse interaction - brighten near cursor
    float mouseDist = distance(st, uMouse);
    float mouseGlow = smoothstep(0.15, 0.0, mouseDist);
    color += mouseGlow * vec3(0.3, 0.2, 0.4);

    fragColor = vec4(color, 1.0);
}
`;

export const final = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uOpacity;
uniform vec2 uResolution;

void main() {
    vec4 tex = texture(uTexture, vUv);
    vec3 color = tex.rgb;

    // Subtle brightness variation
    color *= 1.0 + sin(uTime * 0.2) * 0.1;

    // Clamp to prevent blowout
    color = clamp(color, 0.0, 1.0);

    // Vignette
    float dist = distance(vUv, vec2(0.5));
    color *= smoothstep(0.85, 0.25, dist);

    fragColor = vec4(color, uOpacity);
}
`;
