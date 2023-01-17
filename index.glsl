mat3 calcLookAtMatrix(vec3 origin, vec3 target, float roll) {
  vec3 rr = vec3(sin(roll), cos(roll), 0.0);
  vec3 ww = normalize(target - origin);
  vec3 uu = normalize(cross(ww, rr));
  vec3 vv = cross(uu, ww);

  return mat3(uu, vv, ww);
}

#pragma glslify: export(calcLookAtMatrix)
