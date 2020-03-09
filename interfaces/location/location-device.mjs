import Device from '../device';

export default class Location extends Device {

  constructor(...args) {
    super(...args);
    this.handleProtocol();
  }

  async handleProtocol() {
    for await (const payload of this.protocol) {
      const [longitude, latitude] = payload;
      console.log(payload);
      this.characteristics.Longitude.write(longitude);
      this.characteristics.Latitude.write(latitude);
    }
  }

}
