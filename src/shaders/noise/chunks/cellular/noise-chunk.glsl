#pragma glslify: worley2D = require(glsl-worley/worley2D.glsl)

// Bits and pieces from https://www.shadertoy.com/view/3ls3RX

float rescale(float x, vec2 r1, vec2 r2) {
  float a = r1.x, b = r1.y;
  float c = r2.x, d = r2.y;
  return c + (d - c) * ((x - a)/(b - a));
}

float rescale(float x, vec2 range) {
  float a = range.x, b = range.y;
  return (x - a) / (b - a);
}

float getNoise2D(vec2 pos, float jitter, bool manhattan, int mode) {
    vec2 noise = worley2D(pos, jitter, manhattan);
    float n = 0.0;

    if (mode == 1) n = noise.x;
    if (mode == 2) n = 1.0 - noise.x;

    if (mode == 3) n = noise.y;
    if (mode == 4) n = 1.0 - noise.y;

    if (mode == 5) n = noise.y - noise.x;
    if (mode == 6) n = 1.0 - noise.y - noise.x;

    if (mode == 7) n = noise.x / noise.y;
    if (mode == 8) {
      n = (2.0 * noise.y * noise.x) / (noise.x + noise.y) - noise.x;
      n = rescale(n, vec2(0.0, 0.25));
    }
    return n;
}

#pragma glslify: export(getNoise2D)