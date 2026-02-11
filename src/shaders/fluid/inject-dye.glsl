in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uDye;
uniform float uInject;
uniform float uPaletteBias;

void main() {
    vec4 dye = texture(uDye, vUv);
    MetricSample metric = sampleMetric(vUv);

    float intensity = smoothstep(0.05, 0.35, metric.dm) * uInject;
    vec3 injected = metricPalette(metric.m, metric.dm, uPaletteBias);

    dye.rgb += injected * intensity;
    dye.a = clamp(dye.a + intensity * 0.7, 0.0, 1.0);

    fragColor = dye;
}
