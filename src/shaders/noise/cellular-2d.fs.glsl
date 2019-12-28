#pragma glslify: worley2D = require(glsl-worley/worley2D.glsl)

varying vec2 vUv;
uniform vec2 displacement;
uniform float frequency;
uniform float time;
uniform float jitter;
uniform bool manhattanDistance;
varying float vDistance;

void main(void) {
  vec2 noise = worley2D(vUv * frequency + displacement * time, jitter, manhattanDistance);
  vec3 color = vec3(vUv, 1.0);
	// if (FRAG_MODE == 0) {
	// 	color = vec3(noise.x);
	// }
	// if (FRAG_MODE == 1) {
	// 	color = vec3(noise.y);
	// }
	// if (FRAG_MODE == 2) {
	// 	color = vec3(noise.y - noise.x);
	// }
	if (FRAG_MODE == 0) {
		float dst = clamp(vDistance, 0.0, 1.0);
		color = vec3(vDistance);
	}
  gl_FragColor = vec4(color, 1.0);
}
