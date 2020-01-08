import React, { Component } from "react";
import { Shaders, Node, GLSL as glsl } from "gl-react";
import { Surface } from "gl-react-dom";
import JSON2D from "react-json2d";
import circle from 'circle-enclose';
import multipoint from '../utils/multipoint';
import { A, B, C, miredRange, visibleChromaticity } from '../../../interfaces/hue/color';

const shaders = Shaders.create({
  funky: {
    frag: glsl`
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
        float a =  3.2404542, b = -1.5371385, c = -0.4985314,
              d = -0.9692660, e =  1.8760108, f =  0.0415560,
              g =  0.0556434, h = -0.2040259, i =  1.0572252;
          
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
      uniform float scale;
      uniform sampler2D t;
      uniform sampler2D tongue;
      uniform sampler2D outline;
      uniform vec2 offset;
      void main() {
        float Y = 1.0;

        vec2 scaleCenter = vec2(0.5, 0.5);
        vec2 uvScaled = (uv - scaleCenter) / vec2(scale, scale) + scaleCenter - offset;

        vec3 coords = vec3(uvScaled.x, uvScaled.y, Y);
        // vec3 coords = (vec3(uv.x, uv.y, Y) - vec3(offset, 0))  * vec3(scale, scale, scale);
        vec3 col = xyY_to_scaledAndGammaCorrectedrgb(coords);
        gl_FragColor = vec4(col,1.0) * texture2D(t, uv) * texture2D(tongue, uv) * texture2D(outline, uv);
      }
  ` }
});
const Funky = ({children: [t, tongue, outline], offset, scale}) =>
  <Node shader={shaders.funky} uniforms={{t, tongue, outline, offset, scale}} />;


export default class Example extends Component {
  render() {
    const space = C;
    

const spaceCoords = [[space.red.x, space.red.y], [space.green.x, space.green.y], [space.blue.x, space.blue.y]];
const wrap = circle( spaceCoords.map(([x,y])=>({ x,y,r:0 })));
const offset = { 
  x: (this.props.width / 2) - (wrap.x * this.props.width), 
  y: (this.props.height / 2) - (wrap.y * this.props.height)
};

const scale = 1/(wrap.r*2*this.props.height / this.props.height);

const scaleCoordinates = (x, y) => {
  const scaleX = 1 / (wrap.r * 2 * this.props.width / this.props.width);
  const canvasScaleX = this.props.width;
  const scaleY = 1 / (wrap.r * 2 * this.props.height / this.props.height);
  const canvasScaleY = this.props.height;
  const scaleCenter = 0.5;
  const canvasCenter = canvasScaleX/2;
  const offsetX = offset.x/canvasScaleX;
  const offsetY = offset.y/canvasScaleY;

  return [
    (((x * canvasScaleX) + offset.x) * scaleX) + (canvasCenter - scaleX * canvasScaleX / 2),
    (((canvasScaleY - y * canvasScaleY) - offset.y) * scaleY) + (canvasCenter - scaleY * canvasScaleY / 2),
  ];
}

const spaceCoordsScaled = spaceCoords.map(([x, y]) => scaleCoordinates(x,y))


const scaledPoints = visibleChromaticity.map(([x, y]) => scaleCoordinates(x,y));

const wrapScale = scaleCoordinates(wrap.x, wrap.y);
const wrapScaled = {
  x: wrapScale[0],
  y: wrapScale[1],
  r: wrap.r*this.props.height*scale,
}


    return (
      <Surface width={this.props.width} height={this.props.height}>
        <Funky offset={[offset.x/this.props.width, offset.y/this.props.height]} scale={scale}>
          <JSON2D width={this.props.width} height={this.props.height}>
          {{
            background: "#aaa",
            size: [ this.props.width, this.props.height ],
            draws:  [
              [ "beginPath" ],
              { "fillStyle": "#fff" },
              [ "moveTo", ...spaceCoordsScaled[0] ],
              [ "lineTo", ...spaceCoordsScaled[1] ],
              [ "lineTo", ...spaceCoordsScaled[2] ],
              [ "fill" ],
              [ "closePath" ],
            ],
          }}
          </JSON2D>
          <JSON2D width={this.props.width} height={this.props.height}>
          {{
            background: "#999",
            size: [ this.props.width, this.props.height ],
            draws:  [
              ['beginPath'],
              { "fillStyle": "#fff" },
              ['moveTo', ...scaledPoints[0]],
              ...scaledPoints.slice(1, -2).map((point, i) => {
                var xc = (point[0] + scaledPoints[i + 1][0]) / 2;
                var yc = (point[1] + scaledPoints[i + 1][1]) / 2;
                return ['quadraticCurveTo', point[0], point[1], xc, yc ];
              }),
              ['quadraticCurveTo', scaledPoints[scaledPoints.length -2][0], scaledPoints[scaledPoints.length -2][1], scaledPoints[scaledPoints.length -1][0],scaledPoints[scaledPoints.length -1][1] ],
              [ "fill" ],
              [ "closePath" ],
            ],
          }}
          </JSON2D>
          <JSON2D width={this.props.width} height={this.props.height}>
          {{
            background: "#000",
            size: [ this.props.width, this.props.height ],
            draws:  [
              ['beginPath'],
              { "fillStyle": "#fff" },
              ['arc', wrapScaled.x, wrapScaled.y, wrapScaled.r, 0, Math.PI * 2, true ],
              [ "fill" ],
            ],
          }}
          </JSON2D>
        </Funky>
      </Surface>
    );
  }
};