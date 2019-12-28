varying vec2 vUv;
uniform float time;

void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = (6.0 / -mvPosition.z);
}