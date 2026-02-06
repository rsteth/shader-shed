// No #version here because common.glsl prepends it
// precision highp float; // Also in common.glsl

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState; // The previous frame
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

void main() {
    vec2 st = vUv;
    vec2 pixel = 1.0 / uResolution;

    // Read previous state
    vec4 old = texture(uPrevState, st);

    // Simple diffusion / decay
    float decay = 0.99;
    
    // Interactive ripple
    float dist = distance(st, uMouse);
    float ripple = smoothstep(0.05, 0.0, dist) * 2.0;

    // Fluid-like curl noise (simulated)
    vec2 flow = vec2(
        fbm(st * 3.0 + uTime * 0.1),
        fbm(st * 3.0 + uTime * 0.1 + 10.0)
    ) * 2.0 - 1.0;

    vec2 offset = flow * pixel * 2.0;
    vec4 displaced = texture(uPrevState, st - offset);

    vec3 color = displaced.rgb * decay;
    color += vec3(ripple);

    fragColor = vec4(color, 1.0);
}