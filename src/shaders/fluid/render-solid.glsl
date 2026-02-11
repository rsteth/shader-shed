vec3 renderSolid(vec2 uv, vec4 dye, vec2 vel) {
    float speed = length(vel);
    float shade = smoothstep(0.0, 1.2, speed);
    vec3 color = dye.rgb * (0.75 + shade * 0.45);

    float vignette = smoothstep(0.95, 0.3, distance(uv, vec2(0.5)));
    color *= mix(0.9, 1.1, vignette);

    return color;
}
