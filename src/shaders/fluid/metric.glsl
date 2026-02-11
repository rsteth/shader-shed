uniform sampler2D uOptionsTex;
uniform float uOptionsTexEnabled;
uniform vec2 uOptionsTexSize;
uniform float uSnap;
uniform float uMetricMode;
uniform vec2 uSimResolution;
uniform float uTime;

struct MetricSample {
    float m;
    float dm;
    vec2 grad;
};

vec4 sampleSnapshot(vec2 uv, float index) {
    vec2 clamped = clamp(uv, vec2(0.001), vec2(0.999));
    float slice = clamp(index, 0.0, 2.0);
    vec2 sliceUv = vec2(clamped.x, (clamped.y + slice) / 3.0);
    return texture(uOptionsTex, sliceUv);
}

float syntheticMetric(vec2 uv, float t) {
    vec2 p = uv * 2.0 - 1.0;
    vec2 center = vec2(0.4 * sin(t * 0.6), 0.3 * cos(t * 0.5));
    float ridge = exp(-dot(p - center, p - center) * 4.5);
    float wave = sin(p.x * 3.2 + t * 0.7) * cos(p.y * 2.6 - t * 0.5);
    float ring = exp(-abs(length(p) - 0.35) * 6.0);
    return ridge * 0.8 + wave * 0.35 + ring * 0.25;
}

float metricFromOptions(vec2 uv, float index) {
    vec2 step = 1.0 / uSimResolution;
    vec4 s = sampleSnapshot(uv, index);
    float mode = uMetricMode;

    if (mode < 0.5) {
        float midL = sampleSnapshot(uv - vec2(step.x, 0.0), index).r;
        float midR = sampleSnapshot(uv + vec2(step.x, 0.0), index).r;
        return (midR - midL) * 0.5;
    }

    if (mode < 1.5) {
        return s.a / max(s.r, 0.001);
    }

    float mid0 = sampleSnapshot(uv, 0.0).r;
    float mid2 = sampleSnapshot(uv, 2.0).r;
    return abs(mid2 - mid0);
}

float metricAtIndex(vec2 uv, float index) {
    if (uOptionsTexEnabled > 0.5) {
        return metricFromOptions(uv, index);
    }
    float baseT = uTime * 0.2;
    return syntheticMetric(uv, baseT + index * 1.2);
}

float metricAt(vec2 uv) {
    float snapPos = clamp(uSnap, 0.0, 1.0) * 2.0;
    float idx0 = floor(snapPos);
    float idx1 = min(2.0, idx0 + 1.0);
    float blend = fract(snapPos);
    float m0 = metricAtIndex(uv, idx0);
    float m1 = metricAtIndex(uv, idx1);
    return mix(m0, m1, blend);
}

MetricSample sampleMetric(vec2 uv) {
    vec2 step = 1.0 / uSimResolution;
    float snapPos = clamp(uSnap, 0.0, 1.0) * 2.0;
    float idx0 = floor(snapPos);
    float idx1 = min(2.0, idx0 + 1.0);
    float blend = fract(snapPos);

    float m0 = metricAtIndex(uv, idx0);
    float m1 = metricAtIndex(uv, idx1);
    float m = mix(m0, m1, blend);
    float dm = abs(m1 - m0);

    float mL = metricAt(uv - vec2(step.x, 0.0));
    float mR = metricAt(uv + vec2(step.x, 0.0));
    float mD = metricAt(uv - vec2(0.0, step.y));
    float mU = metricAt(uv + vec2(0.0, step.y));
    vec2 grad = vec2(mR - mL, mU - mD) * 0.5;

    MetricSample outSample;
    outSample.m = m;
    outSample.dm = dm;
    outSample.grad = grad;
    return outSample;
}

vec3 metricPalette(float m, float dm, float bias) {
    float t = clamp(m * 0.5 + 0.5 + bias, 0.0, 1.0);
    vec3 cool = vec3(0.2, 0.6, 1.0);
    vec3 warm = vec3(1.0, 0.4, 0.2);
    vec3 base = mix(cool, warm, t);
    return base * (0.6 + dm * 0.8);
}
