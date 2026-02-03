precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uOpacity;

void main() {
    vec4 tex = texture2D(uTexture, vUv);
    
    // Simple tone mapping or color grading
    vec3 color = tex.rgb;
    
    // Vignette
    float dist = distance(vUv, vec2(0.5));
    color *= smoothstep(0.8, 0.2, dist);

    gl_FragColor = vec4(color, uOpacity);
}
