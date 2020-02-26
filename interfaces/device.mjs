import vm from 'vm';
import createProtocol from './protocols';
import { Stream, PassThrough, pipeline } from 'stream';
import Characteristic from '../system/common/characteristic';

const primativeType = (type) => {
  switch(type) {
    case 'number':
    case 'float':
      return Number;
    case 'boolean':
      return Boolean;
    case 'string':
      return String;
  }
}

export default class Device {
  constructor(device) {
    const { id, mode, characteristics, hub, protocols, register } = device;

    // If protocols are all readable, chain and construct a chained readable 
    // (enqueue from top, read from bottom)
    // If protocol is not array, just select and return as this.protocol
    const protocolLayers = protocols.reduce((layers, options, i) => {
      const protocol = i > 0 && layers[i - 1];
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

    characteristics.forEach(({ name, type, ...options }) => {
      const characteristic = new Characteristic({ device: this, name, type, ...options });
      this.characteristics[name] = characteristic
      const Type = primativeType(type);
      // TODO no setter for read-only characteristics (missing set topic)
      Object.defineProperty(this, name, {
        set(value) {
          console.log('Setting', name, value);
          characteristic.update(value);
        },
        get() {
          const value = new Type(characteristic.lastValue);
          return Object.defineProperty(value, Symbol.asyncIterator, {
            value: characteristic[Symbol.asyncIterator].bind(characteristic),
          })
        }
      });
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