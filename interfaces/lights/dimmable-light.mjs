import Device from '../device';

export default class DimmableLight extends Device {

  constructor(...args) {
    super(...args);
    this.handleProtocol();
  }

  handleProtocol() {
    const Brightness = this.characteristics.Brightness;
    Brightness.on('data', payload => {
      this.protocol.write({ channel: 'brightness', value: payload })
    });
    Brightness.on('request', () => {
      this.protocol.write({ channel: 'brightness', request: true })
    });

    this.protocol.on('data', ({ channel, value }) => {
      console.log('Writing to characteristic', value);
      Brightness.write(value);
    });
  }


}
