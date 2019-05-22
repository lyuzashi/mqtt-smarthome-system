import React, { Component, Fragment } from 'react';
import Device from './device';

const devices = {
  lights: [{
    name: 'Desk Left',
    capabilities: ['brightness', 'temperature'],
  }, {
    name: 'Desk lamp',
    capabilities: ['brightness', 'color', 'temperature']
  }]
}

export default class Controls extends Component {
  // Should read web interface YML of devices
  render() {
    return (
      Object.keys(devices).map(top => (
        <Fragment key={top}>
          {devices[top].map(({ name, capabilities }) => (
            <Device key={`${top}/${name}`} top={top} item={name} capabilities={['on', ...capabilities]} />
          ))}
        </Fragment>
      ))
    )
  }
}