import vm from 'vm';
import createProtocol from './protocols';
import { Stream, PassThrough, pipeline } from 'stream';
import Characteristic from '../system/common/characteristic';

export default class Device {
  constructor(device) {
    const { id, mode, characteristics, hub, protocols, register } = device;

    // If protocols are all readable, chain and construct a chained readable 
    // (enqueue from top, read from bottom)
    // If protocol is not array, just select and return as this.protocol
    console.log(device.fullName, hub);
    const protocolLayers = protocols.reduce((layers, options, i) => {
      const protocol = i > 0 && layers[i - 1];
      console.log('Creating layer', options.type, i, hub, layers.map(l => l.name))
      layers.push(createProtocol({ ...options, hub, device, protocol }));
      return layers;
    }, []);

    if (protocolLayers.length <= 1) {
      this.protocol = protocolLayers[0];
    } else if (protocolLayers.every(layer => layer instanceof Stream)) {
      this.protocol = new PassThrough({ objectMode: true });
      // TODO does a pipeline work in reverse for writing to device?
      pipeline(...protocolLayers, this.protocol);
    } else {
      this.protocol = protocolLayers[protocolLayers.length -1];
    }

    this.characteristics = {};

    characteristics.forEach(({ name, ...options }) => {
      this.characteristics[name] = new Characteristic({ name, device: this, ...options });
      // TODO create getter and setter for each characteristic
    });

    const Brightness = this.characteristics.Brightness;

    Object.defineProperty(this, 'Brightness', {
      set(value) {
        // update triggers a read.push so device protocols are run with new data
        Brightness.update(value);
      },
      get() {
        // return last data from characteristic with Symbol.asyncIterator defined
        const value = new Number(Brightness.lastValue);
        return Object.defineProperty(value, Symbol.asyncIterator, {
          value: Brightness[Symbol.asyncIterator].bind(Brightness),
        })
      }
    });

    register(this);
  }

  // Runs aggregate method when characteristic values change, subscribing as required
  track() {
    const context = vm.createContext(new Proxy({
      // Add any required globals here
    }, {
      get(target, property, receiver) {
        if (!Reflect.has(target, property)) {
          // Subscribe to topic and return last known value
        }
        return Reflect.get(target, property, receiver);
      }
    }));
    new vm.Script(this.aggregate.toString()).runInContext(context);
    // Run this each time something changes
    new vm.Script(`${this.aggregate.name}()`).runInContext(context);
  }

}