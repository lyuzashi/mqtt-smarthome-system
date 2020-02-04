import EventSource from 'eventsource';
import Location from '../location-device';

export default class Overland extends Location {


  constructor(...args) {
    super(...args);
    const stream = new EventSource('https://memory.grid.robotjamie.com/location')
    stream.addEventListener('message', this.handleInterfaceUpdate);
  }

  handleInterfaceUpdate({ data }) {
    const { data: { geometry } } = JSON.parse(data);
    const { coordinates: [longitude, latitude] } = geometry;
    console.log({ longitude, latitude });
    this.characteristic.longitude.update(longitude);
    this.characteristic.latitude.update(latitude);
  }
}

