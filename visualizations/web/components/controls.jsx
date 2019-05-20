import React, { Component, Fragment } from 'react';
import Slider from './slider';
import DeviceSwitch from './device-switch';

export default class Controls extends Component {
  render() {
    return (
      <Fragment>
        <DeviceSwitch top="lights" item="Desk Left" interfaces="on" />
        <DeviceSwitch top="lights" item="Desk Left" interfaces="brightness" style="range" />
      </Fragment>
    )
  }
}