import React, { Component } from 'react';
import { Shaders, Node, GLSL as glsl } from 'gl-react';
import { Surface } from 'gl-react-dom';
import { useSpring, animated } from 'react-spring'
import JSON2D from 'react-json2d';
import circle from 'circle-enclose';
import styled from 'styled-components';
import xy2RGB from '../shaders/xy-to-rgb';
import multiply from '../shaders/multiply';
import smoothPoints from '../utils/smooth-points';
import { A, B, C, miredRange, visibleChromaticity } from '../../../interfaces/hue/color';

const shaders = Shaders.create({
  chromaticity: {
    frag: xy2RGB
  },
  multiply: {
    frag: multiply,
  }
});


const ChromaticityGraph = ({offset, scale}) =>
  <Node shader={shaders.chromaticity} uniforms={{offset, scale}} />;

const Multiply = ({ children: [a, b] }) => <Node shader={shaders.multiply} uniforms={{ a, b }} />;

const MultiplyMany = ({ children }) => children.length > 2 ?
  <Multiply>
    {children[0]}
    <MultiplyMany children={children.slice(1)}></MultiplyMany>
  </Multiply> : <Multiply children={children}/>;

const scaleCoordinates = ({ x, y, width, height, offset, scale }) => {
  return [
    scale.x * (x * width + offset.x) + (width - width * scale.x) / 2,
    (height + height * scale.y - 2 * height * scale.y * y - 2 * offset.y * scale.y) / 2,
  ];
};

// This is the opposite of the function run by shader
function rgb_to_cie(red, green, blue){
	//Apply a gamma correction to the RGB values, which makes the color more vivid and more the like the color displayed on the screen of your device
	var red 	= (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
	var green 	= (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
	var blue 	= (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92); 

	//RGB values to XYZ using the Wide RGB D65 conversion formula
	var X 		= red * 0.664511 + green * 0.154324 + blue * 0.162028;
	var Y 		= red * 0.283881 + green * 0.668433 + blue * 0.047685;
  var Z 		= red * 0.000088 + green * 0.072310 + blue * 0.986039;
  
  // From Philips directly
//   Convert the RGB values to XYZ using the Wide RGB D65 conversion formula The formulas used:
	var X 		= red * 0.649926 + green * 0.103455 + blue * 0.197109;
	var Y 		= red * 0.234327 + green * 0.743075 + blue * 0.022598;
  var Z 		= red * 0.0000000 + green * 0.053077 + blue * 1.035763;

	//Calculate the xy values from the XYZ values
	var x 		= (X / (X + Y + Z)) //.toFixed(4);
	var y 		= (Y / (X + Y + Z)) //.toFixed(4);

	if (isNaN(x))
		x = 0;
	if (isNaN(y))
		y = 0;	 
	return [x, y];
}

const CircularSurface = styled(Surface)`
  border-radius: 100%;
`;

class Chromaticity extends Component {
  render() {
    const { width, height, spaceCoords } = this.props;
    const wrap = circle(spaceCoords.map(([x,y])=>({ x, y, r: 0 })));
    const scaleX = 1 / (wrap.r * 2 * width / width);
    const scaleY = 1 / (wrap.r * 2 * height / height);
    const scale = { x: scaleX, y: scaleY };
    const offset = { 
      x: (this.props.width / 2) - (wrap.x * this.props.width), 
      y: (this.props.height / 2) - (wrap.y * this.props.height)
    };

    const spaceCoordsScaled = spaceCoords.map(([x, y]) => scaleCoordinates({ x,y, width, height, offset, scale }))
    const scaledPoints = visibleChromaticity.map(([x, y]) => scaleCoordinates({ x,y, width, height, offset, scale }));

    const miredRGB = miredRange([153, 500])
      .map(([R,G,B]) => rgb_to_cie(R,G,B))
      .map(([x,y]) => scaleCoordinates({ x,y, width, height, offset, scale }));

    return (
      <CircularSurface width={this.props.width} height={this.props.height}>
        <MultiplyMany>
          <ChromaticityGraph offset={[offset.x/width, offset.y/height]} scale={[scaleX, scaleY]} />
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
              ...smoothPoints(scaledPoints, 0.35),
              [ "fill" ],
              [ "closePath" ],
            ],
          }}
          </JSON2D>
          <JSON2D width={this.props.width} height={this.props.height}>
          {{
            background: "#fff",
            size: [ this.props.width, this.props.height ],
            draws:  [
              ['beginPath'],
              { "strokeStyle": "#333", lineWidth: '0.5', lineCap: 'round' },
              ...smoothPoints(miredRGB, 0.35),
              [ "stroke" ],
              [ "closePath" ],
            ],
          }}
          </JSON2D>
        </MultiplyMany>
      </CircularSurface>
    );
  }
};

const AnimatedChromaticity = animated(Chromaticity);

export default ({ space: spaceName, ...props }) => {
  const currentSpace = ({ A, B, C })[spaceName || 'C'];
  const { space } = useSpring({
    space: [
      currentSpace.red.x,
      currentSpace.red.y,
      currentSpace.green.x,
      currentSpace.green.y,
      currentSpace.blue.x,
      currentSpace.blue.y,
    ]
  });
  const spaceCoords = space.interpolate((rx, ry, gx, gy, bx, by) => [[rx, ry], [gx, gy], [bx, by]] );
  return <AnimatedChromaticity {...props} spaceCoords={spaceCoords} />
}