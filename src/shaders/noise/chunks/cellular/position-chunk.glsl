
vec2 getPosition(vec3 pos, float time, int mode, vec3 normal) {
  vec2 p = pos.xy;
  if (mode == 1) p = pos.xy - pos.z;
  if (mode == 2) p = pos.xy * abs(pos.z);
  if (mode == 3) p = pos.xy + time;
  if (mode == 4) p = normal.xy;
  if (mode == 5) p = normal.xy - pos.z;
  return p;
}

#pragma glslify: export(getPosition)
