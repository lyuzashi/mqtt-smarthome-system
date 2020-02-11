import React from 'react';
import styled from 'styled-components';
import { devices } from '../../../system/devices/web';
import DeviceStatus from './device-status';

console.log(devices);

const DeviceList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-columns: max-content;
  grid-auto-rows: 1fr;
  column-gap: 10px;
  row-gap: 10px;
  margin: 10px;
`;

export default () => {

  return (
    <DeviceList>
      {devices.map(device => <DeviceStatus key={device.fullName} {...device} />)}
    </DeviceList>
  )
}