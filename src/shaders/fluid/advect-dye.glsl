in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uDye;
uniform sampler2D uVelocity;
uniform float uDt;
uniform float uFade;
uniform vec2 uSimResolution;

void main() {
    vec2 vel = texture(uVelocity, vUv).xy;
    vec2 texel = 1.0 / uSimResolution;
    vec2 backtrace = vUv - vel * uDt * texel * 50.0;
    vec4 advected = texture(uDye, clamp(backtrace, vec2(0.0), vec2(1.0)));

    advected.rgb *= (1.0 - uFade);
    advected.a = clamp(advected.a * (1.0 - uFade * 0.5), 0.0, 1.0);

    fragColor = advected;
}
