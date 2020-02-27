import React from 'react';
import styled from 'styled-components';
import Characteristic from './characteristic';
import Geography from './geography';

const Device = styled.div`
  border: 1px solid #353030;
  border-radius: 2px;
  background-color: #222;
  padding: 5px 7px;
  position: relative;
`;

const Name = styled.div`
  font-size: 1.1em;
  color: #eee;
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
`;

export default (device) => {
  const aggregates = [];
  if (device.characteristics) {
    const Longitude = device.characteristics.find(({ name }) => name == 'Longitude');
    const Latitude = device.characteristics.find(({ name }) => name == 'Latitude');
    if (Longitude && Latitude) {
        aggregates.push(<Geography key="geography" center={[Longitude, Latitude]} />);
      }
  }

  return (
    <Device>
      <Name>{device.fullName}</Name>
        {device.characteristics && device.characteristics.map(characteristic =>
          <Characteristic key={characteristic.name} {...characteristic} />
        )}
        {aggregates}
    </Device>
  )
}