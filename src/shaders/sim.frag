precision highp float;

varying vec2 vUv;

uniform sampler2D uPrevState; // The previous frame
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

// Include common functions
// In a real bundler setup, you'd use #include, but for raw-loader we manually concatenate 
// or rely on the pipeline to prepend common code. 
// For this scaffold, I will assume the pipeline prepends 'common.glsl'.

void main() {
    vec2 st = vUv;
    vec2 pixel = 1.0 / uResolution;

    // Read previous state
    vec4 old = texture2D(uPrevState, st);

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
    vec4 displaced = texture2D(uPrevState, st - offset);

    vec3 color = displaced.rgb * decay;
    color += vec3(ripple);

    gl_FragColor = vec4(color, 1.0);
}
