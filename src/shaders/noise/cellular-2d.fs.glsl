
uniform vec2 displacement;
uniform float frequency;
uniform float time;
uniform float jitter;
uniform bool manhattanDistance;
uniform float scale;

varying vec3 vPosition;
varying vec2 vUv;
varying float vDistance;
varying float vNoise;

#pragma glslify: getNoise2D = require('./chunks/cellular/noise-chunk.glsl')
#pragma glslify: getTurbulence = require('./chunks/cellular/turbulence-chunk.glsl',time=time,jitter=jitter, manhattanDistance=manhattanDistance,TURBULENCE_STEPS=TURBULENCE_STEPS)

void main(void) {
  vec3 color = vec3(vUv, 1.0);
	if (FRAG_MODE == 0) {
		float dst = clamp(vDistance, 0.0, 1.0);
		color = vec3(vDistance);
	}
	if (FRAG_MODE > 0) {
		vec2 pos = vPosition.xy * frequency + displacement;
		float noise = 0.0;
		#ifdef TURBULENCE
			noise = getTurbulence(pos, FRAG_MODE);
		#else
			noise = getNoise2D(pos, jitter, manhattanDistance, FRAG_MODE);
		#endif
		color = vec3(noise);
	}
  gl_FragColor = vec4(color, 1.0);
}
