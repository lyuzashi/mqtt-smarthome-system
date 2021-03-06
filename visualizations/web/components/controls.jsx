import React, { Component, Fragment } from 'react';
import Device from './device';

// TODO load devices directly from Hue. These could be published on MQTT with config tree. 
// TODO add metadata such as display position
// TODO Color temp details can come from https://github.com/sqmk/huejay/blob/master/lib/LightModel/LCT010.js#L10
const devices = {
  lights: [{
    name: 'Desk Left',
    capabilities: ['brightness', 'colorTemp'],
    ranges: {
      colorTemp: [156, 370],
    }
  }, {
    name: 'Desk lamp',
    capabilities: ['brightness', 'hue', 'colorTemp', 'saturation'],
    ranges: {
      colorTemp: [153, 500],
      hue: [0, 65535]
    }
  }]
}

export default class Controls extends Component {
  // Should read web interface YML of devices
  render() {
    return (
      Object.keys(devices).map(top => (
        <Fragment key={top}>
          {devices[top].map(({ name, capabilities, ranges = {} }) => (
            <Device
              key={`${top}/${name}`}
              top={top}
              item={name}
              capabilities={['on', ...capabilities]}
              ranges={ranges}
            />
          ))}
        </Fragment>
      ))
    )
  }
}