import React from 'react';
import styled from 'styled-components';
import { divided_A, divided_B, divided_C, miredRange } from '../../../interfaces/hue/color';

const spectrum = divided_B.map(([R,G,B]) => `rgb(${R},${G},${B})`).join();


const Wheel = styled.div`
  width: calc(10em - 10px * 2);
  height: calc(10em - 10px * 2);
  background: conic-gradient(${spectrum}); /* gold 40%, #f06 60%); */
  border-radius: 50%; /* make it round */
  -webkit-mask: radial-gradient(closest-side, transparent calc(100% - 10px), black calc(100% - 9.5px));
`;



export default () => (
  <Wheel></Wheel>
)