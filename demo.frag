precision mediump float;

uniform vec2  iResolution;
uniform float iGlobalTime;

#pragma glslify: smin = require('glsl-smooth-min')
#pragma glslify: look = require('./')

void doCamera(out vec3 camPos, out vec3 camTar, float time, float mouseX) {
  float an = 0.8*iGlobalTime + 10.0*mouseX;
  camPos = vec3(3.5*sin(an),3.0,3.5*cos(an));
  camTar = vec3(0.0,0.0,0.0);
}

vec3 doBackground() {
  return vec3(0.0, 0.0, 0.0);
}

float doModel(vec3 p) {
  float r = 1.0;

  float c1  = length(p) - r;
  float c2  = length(p - vec3(0, 0.5, 2)) - 0.25;
  float gnd = p.y - 0.0;

  return min(c2, smin(c1, gnd, 1.0));
}

vec3 doMaterial(vec3 pos, vec3 nor) {
  return vec3(0.2,0.07,0.01);
}

vec3 doLighting(vec3 pos, vec3 nor, vec3 rd, float dis, vec3 mal) {
  vec3 lin = vec3(0.0);

  vec3  lig = normalize(vec3(1.0,0.7,0.9));
  float dif = max(dot(nor,lig),0.0);

  lin += dif*vec3(4.00,4.00,4.00);
  lin += vec3(0.50,0.50,0.50);

  vec3 col = mal*lin;

  col *= exp(-0.04*dis*dis);

  return col;
}

float calcIntersection(vec3 ro, vec3 rd) {
  const float maxd = 15.0;
  const float precis = 0.01;
  float h = precis*2.0;
  float t = 0.0;
  float res = -1.0;
  for (int i=0; i<30; i++) {
    if (h < precis || t > maxd) break;
    h = doModel(ro+rd*t);
    t += h;
  }

  if (t < maxd) res = t;
  return res;
}

vec3 calcNormal(vec3 pos) {
  const float eps = 0.002;

  const vec3 v1 = vec3( 1.0,-1.0,-1.0);
  const vec3 v2 = vec3(-1.0,-1.0, 1.0);
  const vec3 v3 = vec3(-1.0, 1.0,-1.0);
  const vec3 v4 = vec3( 1.0, 1.0, 1.0);

  return normalize( v1*doModel( pos + v1*eps ) +
                    v2*doModel( pos + v2*eps ) +
                    v3*doModel( pos + v3*eps ) +
                    v4*doModel( pos + v4*eps ) );
}

void main() {
  vec2 p = (2.0*gl_FragCoord.xy-iResolution.xy)/iResolution.y;
  vec2 m = vec2(0.0)/iResolution.xy;

  vec3 ro, ta;
  doCamera(ro, ta, iGlobalTime, m.x);

  mat3 camMat = look(ro, ta, sin(iGlobalTime) * 0.5);
  vec3 rd = normalize(camMat * vec3(p.xy,2.0));

  vec3 col = doBackground();
  float t = calcIntersection(ro, rd);
  if (t > -0.5) {
    vec3 pos = ro + t*rd;
    vec3 nor = calcNormal(pos);
    vec3 mal = doMaterial(pos, nor);

    col = doLighting(pos, nor, rd, t, mal);
  }

  col = pow(clamp(col,0.0,1.0), vec3(0.4545));

  gl_FragColor = vec4( col, 1.0 );
}
