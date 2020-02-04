import PigpioClient from './pigpio-client';
import discover from '../../system/discover';
import { devices } from '../../system/devices';
import PIGPIO from './pigpio-device';

(async () => { 
  for await (const { addresses, port, name } of discover('gpio')) {
    try {
      console.log('Found', name);
      // TODO this should be based on interface, not protocol
      // TODO introduce hub discovery
      const client = new PigpioClient({ host: addresses[0], port });
      const pigpioDevices = devices.
        filter(({ hub, protocol }) =>
          hub === name && 
          protocol.find(({ type }) => type === 'pigpio'))
        .map(device => new PIGPIO({ ...device, client }));

      pigpioDevices.forEach(async d => {
        console.log('Reading', d.name)
        for await (const { topic, payload } of d.read()) {
          console.log('A', topic, payload);
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 100))
        }
        console.log('done')
      })
      pigpioDevices.forEach(async d => {
        console.log('Reading B', d.name)
        for await (const { topic, payload } of d.read()) {
          console.log('B', topic, payload);
        }
        console.log('done')
      });
    } catch (e) {
      console.log(e);
    }
  }
})();
