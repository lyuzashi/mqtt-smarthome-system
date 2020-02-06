import vm from 'vm';
import createProtocol from './protocols';
import { Stream, PassThrough, pipeline } from 'stream';
import Characteristic from '../system/common/characteristic';

export default class Device {
  constructor(device) {
    const { id, mode, characteristics, hub, protocols } = device;

    // If protocols are all readable, chain and construct a chained readable 
    // (enqueue from top, read from bottom)
    // If protocol is not array, just select and return as this.protocol

    const protocolLayers = protocols.map(options => createProtocol({ ...options, device }));

    if (protocolLayers.length <= 1) {
      this.protocol = protocolLayers[0];
    } else if (protocolLayers.every(layer => layer instanceof Stream)) {
      this.protocol = new PassThrough({ objectMode: true });
      // TODO does a pipeline work in reverse for writing to device?
      pipeline(...protocolLayers, this.protocol);
    } else {
      // TODO case where several layers that aren't all streams are used
    }

    this.characteristics = {};

    characteristics.forEach(({ name, ...options }) => {
      this.characteristics[name] = new Characteristic({ name, device: this, ...options });
    })

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