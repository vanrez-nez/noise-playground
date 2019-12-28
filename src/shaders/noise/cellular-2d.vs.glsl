#pragma glslify: worley2D = require(glsl-worley/worley2D.glsl)

varying vec2 vUv;
uniform vec2 displacement;
uniform float frequency;
uniform float time;
uniform float jitter;
uniform bool manhattanDistance;

void main() {
  vUv = uv;
  vec3 pos = position;
  if (VERT_MODE == 0) {
    vec2 noise = worley2D(uv * frequency + displacement * time, jitter, manhattanDistance);
    float f = noise.y - noise.x;
    pos.z = (sin(noise.x * 5.5 + time) - cos(noise.y * 5.5 + time)) * 0.01;
  }
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = (6.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}