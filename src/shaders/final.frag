// No #version here because common.glsl prepends it
// precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uOpacity;

void main() {
    vec4 tex = texture(uTexture, vUv);
    
    // Simple tone mapping or color grading
    vec3 color = tex.rgb;
    
    // Vignette
    float dist = distance(vUv, vec2(0.5));
    color *= smoothstep(0.8, 0.2, dist);

    fragColor = vec4(color, uOpacity);
}