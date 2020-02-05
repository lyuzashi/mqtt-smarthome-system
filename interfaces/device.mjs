import vm from 'vm';
import createProtocol from './protocols';
import { Stream, PassThrough, pipeline } from 'stream';
import Readable from '../system/common/readable';
// import Characteristic from '../../system/common/characteristic';

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
      this.protocol = new PassThrough();
      // TODO does a pipeline work in reverse for writing to device?
      pipeline(...protocolLayers, this.protocol);
    } else {
      // TODO case where several layers that aren't all streams are used
    }

    // TODO assign characteristic instances to device
    Object.assign(this, {
      characteristics,
    });
    
  }

  // previousValue = undefined;

  // This will be in Readable class
  // async *read() {
    // Async generator to await next event (all characteristics)
  // }


  // write() {
  //   // Delegate data to protocol
  // }

  // Request current status from protocol
  // get({ live, characteristic }) {
  //   // this.methods.find(method => method.type === 'get)
  //   // Retrieve latest cached value and callback with refresh method
  //   // Option (live) to return promise which waits for status with timeout?
  //   // const data = await pin.read();
  //   // this.status(data);
  // }

  // Pass data through characteristic and trigger write
  // set({ data, characteristic }) {

  // }


  // Publish status to MQTT (via pushing message to readable)
  // status(data) {
  //   console.dir(this.characteristics, { depth: null });
  //   this.characteristics.forEach(({ logic = [{ name: 'raw' }], methods, type }) => {

  //   });
  // }

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