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
      switch (channel) {
        case 'brightness':
          Brightness.write(value);
        break;
        case 'online': 
          this.characteristics.Online.write(value);
        break;
      }
    });
  }


}
