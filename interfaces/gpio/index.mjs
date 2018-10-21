import YAML from 'yamljs';
import path from 'path';
import truthy from 'truthy';
import root from '../../root';
import gpio from './gpio.js';
import mqtt from '../../system/mqtt';
import shutdown from '../../system/shutdown';
import { context } from '../../system/shell'; 

const config = YAML.load(path.resolve(root, 'config/gpio.yml'));

gpio.on('change', (channel, value) => {
  const conf = config.find(({ pin, direction }) =>
    pin === channel && direction === 'in');
  if (!conf) return;
  const { topic } = conf;
  mqtt.publish({topic, payload: String(value)});
})

config.forEach(async ({ topic, request, pin, direction, edge = 'both' }) => {
  switch(direction) {
    case 'in':
      await gpio.promise.setup(pin, gpio.DIR_IN, edge);
      mqtt.subscribe(request, async () => {
        const value = await gpio.promise.read(pin);
        mqtt.publish({topic, payload: String(value)});
      });
    break;
    case 'out':
      await gpio.promise.setup(pin, gpio.DIR_OUT);
      mqtt.subscribe(topic, async (topic, value) =>
        await gpio.promise.write(pin, truthy(value)));
    break;
  }
})

shutdown.on('exit', gpio.promise.destroy);
context.gpio = gpio;
