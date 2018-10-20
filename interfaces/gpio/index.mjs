import YAML from 'yamljs';
import path from 'path';
import truthy from 'truthy';
import root from '../../root';
import gpio from './gpio.js';
import mqtt from '../../system/mqtt';
import shutdown from '../../system/shutdown';
import { context } from '../../system/shell'; 

const config = YAML.load(path.resolve(root, 'config/gpio.yml'));

config.forEach(async ({ topic, request, pin, direction }) => {
  switch(direction) {
    case 'in':
      await gpio.promise.setup(pin, gpio.DIR_IN, gpio.EDGE_BOTH);
      console.log('subscribing to', request);
      mqtt.subscribe(request, async () => {
        const value = await gpio.promise.read(pin);
        console.log('publishing', topic, value);
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
