#pragma glslify: worley2D = require(glsl-worley/worley2D.glsl)

varying vec2 vUv;
uniform vec2 displacement;
uniform float frequency;
uniform float time;
uniform float jitter;
uniform bool manhattanDistance;

void main(void) {
  vec2 noise = worley2D(vUv * frequency + displacement * time, jitter, manhattanDistance);
	float f = (noise.y * 0.8) - noise.x;
  gl_FragColor = vec4(vec3(f), 1.0);
}
