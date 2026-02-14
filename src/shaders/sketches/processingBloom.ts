/**
 * PROCESSING BLOOM SKETCH
 * Adaptation of a compact Processing point-plotter into a fragment shader.
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform float uTime;
uniform vec2 uResolution;

float pointContribution(vec2 st, vec2 pointPos, float radius) {
    float d = length(st - pointPos);
    return exp(-d * d / max(radius * radius, 1e-5));
}

void main() {
    vec2 st = vUv;
    float t = uTime;

    // The original Processing sketch draws ~20k points.
    // Here we accumulate a reduced set of samples with smooth splats.
    const int SAMPLES = 420;

    vec3 col = vec3(0.0);
    float glow = 0.0;

    for (int idx = 0; idx < SAMPLES; idx++) {
        float fi = float(idx);
        float y = fi / 12.5;

        float base = cos(y * 9.0);
        float k = base * (y < 9.0 ? sin(t + y) * 28.0 : 11.0);
        float e = y / 8.0 - 13.0;
        float o = length(vec2(k, e)) / 6.0;

        float q = k * y / 15.0 + 79.0 + k * sin(y) * (1.0 + sin(o * 4.0 - e - t * 8.0));
        float c = o / 2.0 - e / 4.0 - t + mod(fi, 2.0) * 15.0;

        vec2 p = vec2(
            q * sin(c) + 70.0 * sin(c / 3.0) + 200.0,
            200.0 + (q / 0.7) * cos(c)
        ) / 400.0;

        float spark = pointContribution(st, p, 0.012);
        glow += spark;

        vec3 tint = 0.55 + 0.45 * cos(vec3(0.0, 1.9, 3.8) + o * 2.3 + fi * 0.03 + t);
        col += spark * tint;
    }

    col /= float(SAMPLES) * 0.11;
    glow /= float(SAMPLES) * 0.10;

    col += vec3(0.06, 0.02, 0.09) * pow(glow, 1.5);
    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
`;

export const final = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uOpacity;

void main() {
    vec4 tex = texture(uTexture, vUv);
    vec3 color = tex.rgb;

    float vignette = smoothstep(0.95, 0.25, distance(vUv, vec2(0.5)));
    color *= vignette;

    fragColor = vec4(color, uOpacity);
}
`;
