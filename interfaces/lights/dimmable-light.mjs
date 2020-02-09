import Device from '../device';

export default class DimmableLight extends Device {

  constructor(...args) {
    super(...args);

  this.handleProtocol();
}

async handleProtocol() {
  // Device class needs to setup `state` characteristics with subscriber
  const Brightness = this.characteristics.Brightness;
  Brightness.on('data', payload => {
    console.log('dimmable light', payload)
    this.protocol.write({ channel: 'br', value: payload })
  })
  // do {
  //   console.log('reading...')
  //   for await (const payload of Brightness) {
  //     console.log('light got', payload)
  //     this.protocol.write({ channel: 'br', value: payload });
  //   }
  // } while (true);
}


}
