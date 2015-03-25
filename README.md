# glsl-look-at

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Generates a 3D lookAt matrix in GLSL.

## Usage

[![NPM](https://nodei.co/npm/glsl-look-at.png)](https://nodei.co/npm/glsl-look-at/)

### `mat3 lookAt(vec3 origin, vec3 target, float roll)`

Creates a `mat3` matrix you can use to transform coordinates
to look towards a given point, where:

* `origin` is the position of the camera.
* `target` is the position to look towards.
* `roll` is the roll rotation of the camera.

``` glsl
#pragma glslify: lookAt = require('glsl-look-at')

uniform vec2 iResolution;

void main() {
  // Required bootstrap for a Shadertoy-style
  // raytracing scene:
  vec2 p  = (2.0*gl_FragCoord.xy-iResolution.xy)/iResolution.y;
  vec2 ro = vec3(3.5*sin(0.0),3.0,3.5*cos(0.0));
  vec2 ta = vec3(0.0,0.0,0.0);

  // ...

  mat3 camMat = lookAt(ro, ta, 0.0);
  vec3 rd = normalize(camMat * vec3(p, 2.0));

  // ...
}
```

## Contributing

See [stackgl/contributing](https://github.com/stackgl/contributing) for details.

## License

MIT. See [LICENSE.md](http://github.com/stackgl/glsl-look-at/blob/master/LICENSE.md) for details.
