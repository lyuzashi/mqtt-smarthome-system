import React, { Component } from 'react';
import styled from 'styled-components';

const Blueprint = styled.div`
  margin: 1em;
  max-width: 100%;
  max-height: 100%;
`;

export default class Plan extends Component {
  render() {
    return (
      <Blueprint>
        <img src="/data/FloorPlanBasic.svg" />
      </Blueprint>
    )
  }
}