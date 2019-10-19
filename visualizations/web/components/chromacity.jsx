import React, { useRef, useEffect } from 'react';
import circle from 'circle-enclose';
import multipoint from '../utils/multipoint';
import { A, B, C } from '../../../interfaces/hue/color';
import { throws } from 'assert';

var color_spectrum = [
  [0.177552, 0.013201],
  [0.177442, 0.013217],
  [0.177229, 0.013151],
  [0.176994, 0.013158],
  [0.176762, 0.013031],
  [0.176444, 0.013008],
  [0.175992, 0.013031],
  [0.175495, 0.013063],
  [0.174805, 0.01333],
  [0.173682, 0.014013],
  [0.172229, 0.015121],
  [0.170219, 0.016771],
  [0.167698, 0.019066],
  [0.164333, 0.021995],
  [0.159806, 0.025895],
  [0.154044, 0.030918],
  [0.146902, 0.037868],
  [0.138285, 0.048035],
  [0.12668, 0.06595],
  [0.111852, 0.09499],
  [0.093162, 0.140862],
  [0.07007, 0.208877],
  [0.046225, 0.303041],
  [0.023805, 0.420426],
  [0.008188, 0.545406],
  [0.003783, 0.660625],
  [0.013933, 0.754417],
  [0.039217, 0.814541],
  [0.075015, 0.834925],
  [0.115171, 0.82639],
  [0.155958, 0.805392],
  [0.194252, 0.780704],
  [0.231059, 0.753119],
  [0.267224, 0.722956],
  [0.303004, 0.690898],
  [0.338659, 0.65749],
  [0.374237, 0.623227],
  [0.409656, 0.588587],
  [0.444712, 0.553963],
  [0.479106, 0.519776],
  [0.512455, 0.486535],
  [0.544366, 0.454774],
  [0.574321, 0.424986],
  [0.601689, 0.397671],
  [0.625405, 0.374058],
  [0.646238, 0.353329],
  [0.663443, 0.336271],
  [0.677497, 0.322271],
  [0.688698, 0.311093],
  [0.697619, 0.302233],
  [0.704787, 0.295104],
  [0.710779, 0.289129],
  [0.715674, 0.284243],
  [0.719586, 0.280341],
  [0.722479, 0.277458],
  [0.724574, 0.275369],
  [0.725939, 0.274007],
  [0.727227, 0.272723],
  [0.72821, 0.271742],
  [0.728919, 0.271035],
  [0.729413, 0.270542],
  [0.729714, 0.270242],
  [0.729876, 0.270081],
  [0.730037, 0.26992],
  [0.7301, 0.269857],
  [0.730065, 0.269892],
  [0.729957, 0.27],
  [0.729795, 0.270162],
  [0.729586, 0.27037],
  [0.729331, 0.270624],
  [0.729049, 0.270906],
  [0.728739, 0.271215],
  [0.728408, 0.271545],
  [0.728063, 0.271889],
  [0.727689, 0.272262],
  [0.727304, 0.272646],
  [0.726901, 0.273048],
  [0.726463, 0.273485],
  [0.726021, 0.273925],
  [0.725564, 0.274381],
  [0.725083, 0.274861],
  [0.724592, 0.275351],
  [0.724094, 0.275848],
  [0.723582, 0.276359],
  [0.723065, 0.276874],
  [0.722533, 0.277405],
  [0.721995, 0.277941],
  [0.721458, 0.278476],
  [0.720898, 0.279035],
  [0.720345, 0.279587]
];

// https://codepen.io/bantic/pen/oyRXOX
function drawChromaticityDiagram(canvas) {
  let cd = new ChromaticityDiagram(canvas);
  cd.render();
}


const XYZ_TO_LINEAR_RGB_MATRIX = [
  3.2404542, -1.5371385, -0.4985314,
  -0.9692660, 1.8760108, 0.0415560,
  0.0556434, -0.2040259, 1.0572252
];

function xyY_to_XYZ([x,y,Y]) {
  let X = x*Y/y;
  let Z = (1-x-y)*Y/y;
  return [X,Y,Z];
}

function XYZ_to_linearRGB([X,Y,Z]) {
  return matrix_multiply_vector(XYZ_TO_LINEAR_RGB_MATRIX, [X,Y,Z]);
}

function linearRGB_to_linearrgb([R,G,B]) {
  let max = Math.max(R,G,B);
  return [ R/max, G/max, B/max ];
}

function linearC_to_gammaCorrectedC(c) {
  const a = 0.055;

  return c <= 0.0031308 ?
    12.92 * c :
    (1+a)*(Math.pow(c, 1/2.4)) - a
}

function linearrgb_to_gammaCorrectedrgb([lr,lg,lb]) {
  return [lr,lg,lb].map(linearC_to_gammaCorrectedC);
}

function xyY_to_scaledAndGammaCorrectedrgb(xyY) {
  let XYZ = xyY_to_XYZ(xyY);
  let RGB = XYZ_to_linearRGB(XYZ);
  // if (RGB.some(i => i < 0)) { return [0,0,0]; }
  let rgb = linearRGB_to_linearrgb(RGB);
  let gamma_rgb = linearrgb_to_gammaCorrectedrgb(rgb);
  let scaled_rgb = gamma_rgb.map(i => Math.floor(i * 255));
  return scaled_rgb;
}

function matrix_multiply_vector([
  a, b, c,
  d, e, f,
  g, h, i
], [
  x,
  y,
  z
]) {
  return [
    a * x + b * y + c * z,
    d * x + e * y + f * z,
    g * x + h * y + i * z
  ];
}

class ChromaticityDiagram {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = parseInt(this.canvas.getAttribute('width'));
    this.height = parseInt(this.canvas.getAttribute('height'));
  }

  render() {
    let imageData = this.ctx.createImageData(this.width, this.height);
    let canvasX = 0;
    let canvasY = 0;

    let Y = 1.0;
    let alpha = 255;

    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let x = canvasX/this.width;
      let y = (this.height - canvasY)/this.height;
      let [r,g,b] = xyY_to_scaledAndGammaCorrectedrgb([x,y,Y]);
      data[i] = r;
      data[i+1] = g;
      data[i+2] = b;
      data[i+3] = alpha;

      canvasX = canvasX + 1;
      if (canvasX >= this.width) {
        canvasY = canvasY + 1;
        canvasX = 0;
      }
    }

    this.ctx.putImageData(imageData, 0, 0);

    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 1;

    const scaledPoints = color_spectrum.map(([x, y]) => [
      x * this.width,
      this.height - y * this.height
    ]);

    multipoint(
      this.ctx,
      scaledPoints,
      0.4
    );


    const space = A;

    const BCoords = [[space.red.x, space.red.y], [space.green.x, space.green.y], [space.blue.x, space.blue.y]].map(([x, y]) => [
      x * this.width,
      this.height - y * this.height
    ]);

    this.ctx.beginPath();
    this.ctx.moveTo(...BCoords[0]);
    this.ctx.lineTo(...BCoords[1]);
    this.ctx.lineTo(...BCoords[2]);
    this.ctx.closePath();
    this.ctx.stroke();

    const wrap = circle( BCoords.map(([x,y])=>({ x,y,r:0 })));
    console.log(wrap);
    this.ctx.beginPath();
    this.ctx.arc(wrap.x, wrap.y, wrap.r, 0, Math.PI * 2, true); 
    this.ctx.stroke();


  }
}

// TODO prop for space coordinates
// calculate circle around coordinates (default to CIE curve)
// Base calculations on circle center, scale to circle size
// Grey out outside of CIE curve
// Provide crosshair interface, snapping to inside of space
export default ({ width, height, className }) => {
  const canvas = useRef();
  useEffect(() => {
    // Does this cache the drawing?
    drawChromaticityDiagram(canvas.current);
  }, [canvas]);
  return (
    <div style={{width, height}} className={className}>
      <canvas width="200%" height="200%" style={{ width: '100%', height: '100%' }} ref={canvas} />
    </div>
  );
}

