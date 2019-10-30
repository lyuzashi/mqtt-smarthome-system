import pigpio from 'pigpio-client';
import GPIO from './gpio';
import discover from '../../system/discover';
import devices from '../../system/devices';

class PIGPIO extends GPIO {
  constructor(...args) {
    super(...args);
    const [{ client }] = args;
    client.once('connected', () => {}); 

    this.pin = client.gpio(this.id);
    this.pin.modeSet(this.mode);
    this.pin.notify(this.edge);
  }

  edge(level, tick) {
    this.status('');
  }
}

(async () => { 
  for await (const { addresses, port, name } of discover('gpio')) {
    const client = pigpio({ host: addresses[0], port });

    devices.
      filter(({ hub, protocol }) =>
        hub === name && 
        protocol.find(({ type }) => type === 'pigpio'))
      .forEach(device => new PIGPIO({ ...device, client }));
  }
})()

