import React from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import Chromacity from '../components/chromacity';
import ChromacityGL from '../components/chromacitygl';
import Dial from '../components/dial';
import Geography from '../components/geography';
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
    props: {
      width: '500px',
      height: '500px',
    }, // storyProps // adding props
  },
  {
    name: 'chromacitgl',
    component: Centred(ChromacityGL),
    props: {
      width: 500,
      height: 500,
      space: 'C',
    },
  },
  {
    name: 'dial',
    component: Centred(Dial),
    props: {
      width: '200px',
      height: '200px',
    }, // storyProps // adding props
  },
  {
    name: 'geography',
    component: Geography,
  }
];