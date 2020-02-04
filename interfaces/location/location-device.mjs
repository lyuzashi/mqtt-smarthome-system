import Device from '../device';
import Characteristic from '../../system/common/characteristic';

export default class Location extends Device {

  constructor(...args) {
    super(...args);
    // Add characteristics for longitude and latitude

    // TODO read() raw protocol data and spit out characteristics
    this.handleProtocol();
  }

  async handleProtocol() {
    for await (const payload of this.protocol.read()) {
      console.log('New payload', payload);
      // TODO pass through overland protocol?
    }
  }

}
