uniform vec2 displacement;
uniform float frequency;
uniform float time;
uniform float jitter;
uniform float scale;
uniform bool manhattanDistance;

varying vec3 vPosition;
varying vec2 vUv;
varying float vDistance;

#pragma glslify: getNoise2D = require('./chunks/cellular/noise-chunk.glsl')
#pragma glslify: getPosition = require('./chunks/cellular/position-chunk.glsl')
#pragma glslify: getTurbulence = require('./chunks/cellular/turbulence-chunk.glsl',time=time, jitter=jitter, manhattanDistance=manhattanDistance,TURBULENCE_STEPS=TURBULENCE_STEPS)

void main() {
  vUv = uv;
  vPosition = vec3(getPosition(position, time, POS_MODE, normal), position.z);
  vec3 newPosition = position;
  if (VERT_MODE > 0) {
    vec2 pos = vPosition.xy * frequency + displacement;
    float noise = 0.0;
    #ifdef TURBULENCE
      noise = getTurbulence(pos, VERT_MODE) * scale;
    #else
      noise = getNoise2D(pos, jitter, manhattanDistance, VERT_MODE) * scale;
    #endif

    newPosition += normal * noise;
  }
  vDistance = distance(position, newPosition) / scale;
  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
  gl_PointSize = (4.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}