import PigpioClient from './pigpio-client';
import GPIO from './gpio';
import discover from '../../system/discover';
import devices from '../../system/devices';

class PIGPIO extends GPIO {
  constructor(options) {
    super(options);
    Object.assign(this, options);
    this.init();
  }

  async init() {
    await this.client.ready;
    console.log(this.client, this.id);
    this.pin = this.client.gpio(this.id);
    console.log(this.pin);
    this.pin.modeSet('input'); // TODO translate this.mode
    this.pin.notify(this.edge);
    console.log(this);
  }

  edge(level, tick) {
    this.status('');
  }
}

(async () => { 
  for await (const { addresses, port, name } of discover('gpio')) {
    console.log('Found', name, addresses, port );
    const client = new PigpioClient({ host: addresses[0], port });
    devices.
      filter(({ hub, protocol }) =>
        hub === name && 
        protocol.find(({ type }) => type === 'pigpio'))
      .map(device => new PIGPIO({ ...device, client }));
  }
})().catch(error => console.warn(error));

