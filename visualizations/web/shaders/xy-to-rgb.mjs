import { GLSL as glsl } from 'gl-react';

export default glsl`
precision highp float;

float linearC_to_gammaCorrectedC(float c) {
  float a = 0.055;
  return c <= 0.0031308 ?
    12.92 * c :
    (1.0+a)*(pow(c, 1.0/2.4)) - a;
}

vec3 linearrgb_to_gammaCorrectedrgb(vec3 linear) {
  return vec3(
    linearC_to_gammaCorrectedC(linear.x),
    linearC_to_gammaCorrectedC(linear.y),
    linearC_to_gammaCorrectedC(linear.z)
  );
}

vec3 XYZ_to_linearRGB(vec3 XYZ) {
  // mat4 type
  // This could come from a 9-element array as a uniform
  // sRGB D65
  // float a =  3.2404542, b = -1.5371385, c = -0.4985314,
  //       d = -0.9692660, e =  1.8760108, f =  0.0415560,
  //       g =  0.0556434, h = -0.2040259, i =  1.0572252;

  // Directly from Philips - Wide Gamut RGB D50
  float a =  1.4628067, b = -0.1840623, c = -0.2743606,
        d = -0.5217933, e =  1.4472381, f =  0.0677227,
        g =  0.0349342, h = -0.0968930, i =  1.2884099;
    
  return vec3(
    a * XYZ.x + b * XYZ.y + c * XYZ.z,
    d * XYZ.x + e * XYZ.y + f * XYZ.z,
    g * XYZ.x + h * XYZ.y + i * XYZ.z    
  );
}

vec3 xyY_to_XYZ(vec3 xyY) {
  float y = max(0.0000001, xyY.y);
  float Y = xyY.z;
  float X = xyY.x*Y/y;
  float Z = (1.0-xyY.x-y)*Y/y;
  return vec3(X,Y,Z);
}

vec3 linearRGB_to_linearrgb(vec3 RGB) {
  float maxVec = max(max(RGB.r,RGB.g), RGB.b);
  return vec3(RGB.r/maxVec, RGB.g/maxVec, RGB.b/maxVec);
}

vec3 xyY_to_scaledAndGammaCorrectedrgb(vec3 xyY) {
  vec3 XYZ = xyY_to_XYZ(xyY);
  vec3 RGB = XYZ_to_linearRGB(XYZ);
  vec3 rgb = linearRGB_to_linearrgb(RGB);
  vec3 gamma_rgb = linearrgb_to_gammaCorrectedrgb(rgb);
  return gamma_rgb;   
}

varying vec2 uv;
uniform vec2 scale;
uniform vec2 offset;
void main() {
  float Y = 1.0; // Brightness

  vec2 scaleCenter = vec2(0.5, 0.5);
  vec2 uvScaled = (uv - scaleCenter) / scale + scaleCenter - offset;

  vec3 coords = vec3(uvScaled.x, uvScaled.y, Y);
  vec3 col = xyY_to_scaledAndGammaCorrectedrgb(coords);
  gl_FragColor = vec4(col,1.0);
}
`;
