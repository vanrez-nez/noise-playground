#ifdef GL_ES
precision mediump float;
#endif
#pragma glslify: worley2D = require(glsl-worley/worley2D.glsl)

uniform vec2 resolution;
uniform vec2 displacement;
uniform float frequency;
uniform float time;

void main(void) {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 noise = worley2D(uv * frequency + displacement * time, 0.5, false);
	float f = (noise.y * 0.8) - noise.x;
  gl_FragColor = vec4(vec3(f), 1.0);
}
