// https://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/
#pragma glslify: getNoise2D = require('./noise-chunk.glsl')

float getTurbulence(vec2 p, int mode) {
  float t = 0.0;
  for (float f = 1.0; f <= TURBULENCE_STEPS; f++) {
    float power = pow(2.0, f);
    t += abs(getNoise2D((p + (time * f * 0.001 * power)) * power, jitter, manhattanDistance, mode) / power);
  }
  return t;
}

#pragma glslify: export(getTurbulence)
