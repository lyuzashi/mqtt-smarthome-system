import React from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

const position = [51.505, -0.09]
export default () => (
  <Map center={position} zoom={13}>
    <TileLayer
      url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
      attribution="Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL."
    />
    <Marker position={position}>
      <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
    </Marker>
  </Map>
)