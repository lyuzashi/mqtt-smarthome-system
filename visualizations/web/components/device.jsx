import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import DeviceSwitch from './device-switch';

const styles = {
  on: 'checkbox',
  brightness: 'range',
  temperature: 'range',
  color: 'range',
}

const Title = styled.h2`
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  font-size: 1em;
  font-weight: 500;
  margin: 0;
  padding: 0;
  color: rgba(110, 106, 100);
  text-shadow: 0 -1px 0px rgba(30, 30, 30, 0.95);
`;

export default class Device extends Component {
  render() {
    const { top, item, capabilities } = this.props;
    return (
      <Fragment>
        <Title>{item}</Title>
        {capabilities.map(capability => (
          <DeviceSwitch key={capability} top={top} item={item} interfaces={capability} style={styles[capability]} />
        ))}
      </Fragment>
    );
  }
}