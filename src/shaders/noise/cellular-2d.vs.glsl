#pragma glslify: worley2D = require(glsl-worley/worley2D.glsl)

uniform vec2 displacement;
uniform float frequency;
uniform float time;
uniform float jitter;
uniform float scale;
uniform bool manhattanDistance;

varying vec2 vUv;
varying float vDistance;

void main() {
  vUv = uv;
  vec3 newPosition = position;
  if (VERT_MODE == 0) {
    //vec2 noisePosition = vec2(sin(position.xy + time));
    vec2 noisePosition = position.xy;
    //vec2 noisePosition = position.xy * abs(position.z);
    //vec2 noisePosition = position.xy - position.z;
    //vec2 noisePosition = (position * normal).xy;
    vec2 noise = abs(worley2D(noisePosition * frequency + displacement, jitter, manhattanDistance));
    float f = (noise.y - noise.x) * scale;
    newPosition += normal * f;
  }
  vDistance = distance(position, newPosition) / scale * 0.5;
  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
  gl_PointSize = (6.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}