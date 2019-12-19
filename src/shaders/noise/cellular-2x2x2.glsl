precision highp float;
#pragma glslify: worley2x2x2 = require(glsl-worley/worley2x2x2.glsl)

uniform vec2 resolution;
uniform vec2 displacement;
uniform float frequency;
uniform float time;
uniform float jitter;
uniform bool manhattanDistance;
uniform int mode;

void main(void) {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec3 noise = worley2x2x2(uv * frequency + displacement * time, jitter, manhattanDistance);
	float f = 0.0;
	if (mode == 0) {
		f = noise.x;
	}
	if (mode == 1) {
		f = noise.y;
	}
	if (mode == 2) {
		f = noise.y - noise.x;
	}
  gl_FragColor = vec4(vec3(f), 1.0);
}