import PigpioClient from './pigpio-client';
import discover from '../../system/discover';
import devices from '../../system/devices';
import PIGPIO from './pigpio-device';

(async () => { 
  for await (const { addresses, port, name } of discover('gpio')) {
    const client = new PigpioClient({ host: addresses[0], port });
    devices.
      filter(({ hub, protocol }) =>
        hub === name && 
        protocol.find(({ type }) => type === 'pigpio'))
      .map(device => new PIGPIO({ ...device, client }));
  }
})();
