  precision mediump float;
  uniform vec2 resolution;
  uniform float time;

  void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    gl_FragColor = vec4(vec3(uv, 1.0), 1.0);
  }