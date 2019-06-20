import React from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import Chromacity from '../components/chromacity';
import Dial from '../components/dial';
import { Centred } from 'story-router';

// const storyProps = { text: 'Parcel Storybook' };
// const buttonProps = {
//   name: 'My Button',
//   style: {
//     margin: '10px',
//     height: '30px',
//     color: 'black',
//     background: 'blue'
//   }
// };

const SizedContainer = styled.div`
  width: 300px;
  height: 300px;
`;

export default [
  {
    name: 'chromacity',
    component: Centred(Chromacity),
    // props: {}, // storyProps // adding props
  },
  {
    name: 'dial',
    component: Centred(Dial),
    props: {}, // storyProps // adding props
  },
];