in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uVelocity;
uniform float uDt;
uniform float uDamp;
uniform vec2 uSimResolution;

void main() {
    vec2 vel = texture(uVelocity, vUv).xy;
    vec2 texel = 1.0 / uSimResolution;
    vec2 backtrace = vUv - vel * uDt * texel * 40.0;
    vec2 advected = texture(uVelocity, clamp(backtrace, vec2(0.0), vec2(1.0))).xy;

    advected *= (1.0 - uDamp * 0.5);

    fragColor = vec4(advected, 0.0, 1.0);
}
