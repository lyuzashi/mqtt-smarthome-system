import React, { useState, useEffect } from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import styled from 'styled-components';
import mqtt from '../mqtt-client';
import 'leaflet/dist/leaflet.css';

const Geography = styled(Map)`
  width: 100%;
  height: 100%;
  -webkit-mask-image: -webkit-gradient(linear, 30% top, left top, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
`;

const useCharacteristic = (characteristic) => {
  const [value, setValue] = useState(null);
  useEffect(() => {
    const topic = characteristic.methods.find(({ method })  => method == 'status').topic;
    mqtt.subscribe(topic, (v) => { setValue(v) })

    return () => {
      mqtt.unsubscribe(topic, setValue);
    };
  });


  return value;
}

export default ({ center }) => {
  const lng = useCharacteristic(center[0]);
  const lat = useCharacteristic(center[1]);

  return (lng && lat && 
    <Geography center={[lat, lng]} zoom={13}>
      <TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]}>
        <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
      </Marker>
    </Geography>
  );
}