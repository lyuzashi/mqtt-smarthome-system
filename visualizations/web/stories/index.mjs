import React from 'react';
import Button from '../components/Button';
import Chromacity from '../components/chromacity';
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

export default [
  {
    name: 'chromacity',
    component: Centred(Chromacity),
    // props: {}, // storyProps // adding props
  },
];