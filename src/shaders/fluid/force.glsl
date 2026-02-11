in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uVelocity;
uniform float uDt;
uniform float uForce;
uniform float uDamp;

void main() {
    vec2 vel = texture(uVelocity, vUv).xy;
    MetricSample metric = sampleMetric(vUv);

    float mag = clamp(metric.dm * 2.0, 0.0, 1.0);
    float signedField = sign(metric.m + 0.001);
    vec2 force = metric.grad * signedField * (uForce * (0.4 + mag));

    float swirl = noise(vUv * uSimResolution * 0.015 + uTime * 0.2) - 0.5;
    vec2 curl = vec2(swirl, -swirl) * 0.35;

    vel += (force + curl) * uDt;
    vel *= (1.0 - uDamp);
    vel = clamp(vel, vec2(-3.0), vec2(3.0));

    fragColor = vec4(vel, 0.0, 1.0);
}
