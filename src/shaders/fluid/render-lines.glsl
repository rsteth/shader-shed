float renderLines(vec2 uv) {
    vec2 dir = texture(uVelocity, uv).xy;
    float speed = length(dir);
    dir = normalize(dir + 1e-4);

    float acc = 0.0;
    vec2 p = uv;
    float stepSize = 6.0 / max(uSimResolution.x, uSimResolution.y);

    for (int i = 0; i < 16; i++) {
        p += dir * stepSize;
        p = clamp(p, vec2(0.0), vec2(1.0));

        float n = noise(p * uLineDensity * 8.0 + uTime * 0.05);
        float stripe = smoothstep(0.45, 0.45 + uLineSharpness * 0.12, n);
        acc += stripe;

        vec2 nextVel = texture(uVelocity, p).xy;
        dir = normalize(mix(dir, nextVel, 0.4) + 1e-4);
    }

    float lines = acc / 16.0;
    float taper = smoothstep(0.0, 0.6, speed);
    return lines * taper;
}
