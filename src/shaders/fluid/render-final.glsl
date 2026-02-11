in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uDye;
uniform sampler2D uVelocity;
uniform float uMode;
uniform float uOpacity;
uniform float uLineDensity;
uniform float uLineSharpness;
uniform float uDebug;

void main() {
    vec4 dye = texture(uDye, vUv);
    vec2 vel = texture(uVelocity, vUv).xy;

    vec3 solidColor = renderSolid(vUv, dye, vel);
    float lineValue = renderLines(vUv);
    vec3 lineColor = vec3(lineValue);

    vec3 color = mix(solidColor, lineColor, clamp(uMode, 0.0, 1.0));

    if (uDebug > 0.5 && uDebug < 1.5) {
        float speed = length(vel);
        color = vec3(speed);
    } else if (uDebug >= 1.5) {
        MetricSample metric = sampleMetric(vUv);
        color = vec3(metric.m * 0.5 + 0.5);
    }

    fragColor = vec4(color, uOpacity);
}
