import React from 'react';
import styled from 'styled-components';
import Chromacity from './chromacity';
import { divided_A, divided_B, divided_C, miredRange } from '../../../interfaces/hue/color';

const spectrumA = divided_A.map(([R,G,B]) => `rgb(${R},${G},${B})`).join();
const spectrumB = divided_B.map(([R,G,B]) => `rgb(${R},${G},${B})`).join();
const spectrumC = divided_C.map(([R,G,B]) => `rgb(${R},${G},${B})`).join();
const spectrumMired = miredRange([153, 500]).map(([R,G,B]) => `rgb(${R},${G},${B})`).join();
const brightness = [0, 100].map(l => `hsl(0,0%,${l}%)`).join();

const Wheel = styled.div`
  width: calc(100% - (${props => props.width} * ${props => props.index} * 2));
  height: calc(100% - (${props => props.width} * ${props => props.index} * 2));
  position: absolute;
  background: conic-gradient(${props => props.spectrum});
  border-radius: 50%;
  -webkit-mask: radial-gradient(
    closest-side, 
    transparent calc(100% - ${props => props.width}), 
    black calc(100% - ${props => props.width} - 0.5px)
  );
  transform: rotate(180deg);
  /* opacity: 0.1; */
`;

Wheel.defaultProps = {
  index: 0,
  spectrumA,
  width: '13px',
};

const Container = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Chroma = styled(Chromacity)`
  width: calc(100% - 3 * 2 * 13px);
  height: calc(100% - 3 * 2 * 13px);
  border-radius: 50%;
  overflow: hidden;
`;

export default (props) => (
  <Container {...props}>
    <Wheel index="0" spectrum={spectrumMired}/>
    <Wheel index="1" spectrum={brightness} />
    <Wheel index="2" spectrum={spectrumB}/>
    <Chroma/>
  </Container>
)