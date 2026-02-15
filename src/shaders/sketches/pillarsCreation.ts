/**
 * PILLARS OF CREATION SKETCH
 * Multi-variation volumetric pillars integrated into a single raymarch.
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform float uTime;
uniform vec2 uResolution;

float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

float valueNoise(vec3 position) {
    vec3 cell = floor(position);
    vec3 local = fract(position);
    local = local * local * (3.0 - 2.0 * local);

    float base = dot(cell, vec3(1.0, 57.0, 113.0));

    float x1 = mix(hash(base + 0.0), hash(base + 1.0), local.x);
    float x2 = mix(hash(base + 57.0), hash(base + 58.0), local.x);
    float y1 = mix(x1, x2, local.y);

    float x3 = mix(hash(base + 113.0), hash(base + 114.0), local.x);
    float x4 = mix(hash(base + 170.0), hash(base + 171.0), local.x);
    float y2 = mix(x3, x4, local.y);

    return mix(y1, y2, local.z);
}

float fbm3(vec3 position) {
    float amplitude = 0.5;
    float result = 0.0;

    for (int octave = 0; octave < 5; octave++) {
        result += amplitude * valueNoise(position);
        position *= 2.02;
        amplitude *= 0.5;
    }

    return result;
}

vec3 hubblePalette(float sulfur, float hydrogen, float oxygen) {
    vec3 sulfurColor = vec3(1.2, 0.25, 0.08);
    vec3 hydrogenColor = vec3(0.15, 1.1, 0.25);
    vec3 oxygenColor = vec3(0.08, 0.35, 1.2);

    return sulfur * sulfurColor
         + hydrogen * hydrogenColor
         + oxygen * oxygenColor;
}

float cylinderSDF(vec3 position, float radius) {
    return length(position.xz) - radius;
}

float sdfPillarMap(vec3 position, float t) {
    float minDistance = 1e6;

    vec3 trunkA = position - vec3(-0.7, 0.0, 0.2);
    trunkA.xz *= mat2(0.98, -0.2, 0.2, 0.98);
    minDistance = min(minDistance, cylinderSDF(trunkA, 0.35));

    vec3 trunkB = position - vec3(0.0, 0.0, 0.0);
    trunkB.xz *= mat2(0.95, 0.32, -0.32, 0.95);
    minDistance = min(minDistance, cylinderSDF(trunkB, 0.42));

    vec3 trunkC = position - vec3(0.65, 0.0, -0.15);
    trunkC.xz *= mat2(0.99, 0.1, -0.1, 0.99);
    minDistance = min(minDistance, cylinderSDF(trunkC, 0.30));

    minDistance += 0.25 * (position.y - 0.3);
    minDistance += (fbm3(position * 1.2 + vec3(0.0, t * 0.04, 0.0)) - 0.5) * 0.22;

    return minDistance;
}

float densityOrganic(vec3 samplePosition) {
    vec3 warp = vec3(
        fbm3(samplePosition * 0.35 + 13.1),
        fbm3(samplePosition * 0.35 - 7.2),
        fbm3(samplePosition * 0.35 + 2.7)
    );

    vec3 warpedPosition = samplePosition + 0.9 * (warp - 0.5);

    float baseNoise = fbm3(vec3(
        warpedPosition.x * 0.55,
        warpedPosition.y * 0.12,
        warpedPosition.z * 0.55));

    float ridge = 1.0 - abs(2.0 * baseNoise - 1.0);
    float pillarMask = smoothstep(0.35, 0.85, ridge)
                    * smoothstep(-0.2, 1.6, warpedPosition.y);

    float erosion = fbm3(warpedPosition * 1.4);
    return max(0.0, pillarMask * (0.9 - 0.8 * erosion));
}

float densitySdf(vec3 samplePosition, float t) {
    float sdfDistance = sdfPillarMap(samplePosition, t);
    float shell = exp(-abs(sdfDistance) * 10.0);
    float fog = smoothstep(0.0, 1.0, fbm3(samplePosition * 0.6)) * 0.25;
    return clamp(shell + fog - 0.15, 0.0, 1.0);
}

float densityCurl(vec3 samplePosition) {
    vec3 gradient = vec3(
        fbm3(samplePosition + vec3(0.02, 0.0, 0.0)) - fbm3(samplePosition - vec3(0.02, 0.0, 0.0)),
        fbm3(samplePosition + vec3(0.0, 0.02, 0.0)) - fbm3(samplePosition - vec3(0.0, 0.02, 0.0)),
        fbm3(samplePosition + vec3(0.0, 0.0, 0.02)) - fbm3(samplePosition - vec3(0.0, 0.0, 0.02))
    );

    vec3 curlFlow = vec3(
        gradient.y - gradient.z,
        gradient.z - gradient.x,
        gradient.x - gradient.y
    );

    vec3 advectedPosition = samplePosition + 0.55 * curlFlow;
    advectedPosition.y *= 0.7;

    return clamp(
        fbm3(advectedPosition * 0.9)
        - 0.35 * fbm3(advectedPosition * 2.2)
        + 0.25 * smoothstep(-0.2, 1.6, advectedPosition.y),
        0.0,
        1.0
    );
}

float densityRidged(vec3 samplePosition) {
    vec3 scaled = vec3(
        samplePosition.x * 0.65,
        samplePosition.y * 0.14,
        samplePosition.z * 0.65
    );

    float ridge = 1.0 - abs(2.0 * fbm3(scaled) - 1.0);
    float density = smoothstep(0.35, 0.95, ridge)
                  * smoothstep(-0.2, 1.8, samplePosition.y);

    float dust = fbm3(scaled * 3.0);
    return max(0.0, density - 0.65 * dust);
}

void main() {
    vec2 fc = vUv * uResolution;
    vec2 r = uResolution;
    float t = uTime;

    vec2 uv = (fc - 0.5 * r) / r.y;

    vec3 rayOrigin = vec3(0.0, 0.2, -3.2)
                   + vec3(0.15 * sin(t * 0.05), 0.05 * sin(t * 0.03), t * 0.05);
    vec3 rayDirection = normalize(vec3(uv, 1.25));

    vec3 accumulatedColor = vec3(0.0);
    float transmittance = 1.0;
    float rayDistance = 0.0;

    const float maxSteps = 120.0;
    const float stepSize = 0.05;

    for (float stepIndex = 0.0; stepIndex < maxSteps; stepIndex++) {
        vec3 samplePosition = rayOrigin + rayDirection * rayDistance;

        float d1 = densityOrganic(samplePosition - vec3(-2.1, 0.0, 0.0));
        float d2 = densitySdf(samplePosition - vec3(-0.7, 0.0, 0.0), t);
        float d3 = densityCurl(samplePosition - vec3(0.7, 0.0, 0.0));
        float d4 = densityRidged(samplePosition - vec3(2.1, 0.0, 0.0));

        float mask1 = smoothstep(1.6, 0.15, abs(samplePosition.x + 2.1));
        float mask2 = smoothstep(1.6, 0.15, abs(samplePosition.x + 0.7));
        float mask3 = smoothstep(1.6, 0.15, abs(samplePosition.x - 0.7));
        float mask4 = smoothstep(1.6, 0.15, abs(samplePosition.x - 2.1));

        float density = d1 * mask1 + d2 * mask2 + d3 * mask3 + d4 * mask4;
        density = clamp(density, 0.0, 1.0);

        float sulfur = density * smoothstep(0.2, 0.9, fbm3(samplePosition * 0.8));
        float hydrogen = density * smoothstep(-0.1, 1.4, samplePosition.y);
        float oxygen = density * smoothstep(0.3, 0.85, fbm3(samplePosition * 1.7 + 5.0));

        vec3 emission = hubblePalette(sulfur, hydrogen, oxygen);

        accumulatedColor += transmittance * emission * stepSize;

        float absorptionCoefficient = 2.5;
        transmittance *= exp(-density * absorptionCoefficient * stepSize);

        if (transmittance < 0.02) {
            break;
        }

        rayDistance += stepSize;
    }

    fragColor = vec4(accumulatedColor, 1.0);
}
`;

export const final = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uOpacity;

void main() {
    vec4 tex = texture(uTexture, vUv);
    fragColor = vec4(tex.rgb, uOpacity);
}
`;
