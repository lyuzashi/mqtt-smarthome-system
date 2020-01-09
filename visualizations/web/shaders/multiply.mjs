import { GLSL as glsl } from 'gl-react';

export default glsl`
precision highp float;
uniform sampler2D a;
uniform sampler2D b;
varying vec2 uv;
void main() {
  gl_FragColor = texture2D(a, uv) * texture2D(b, uv);
}
`