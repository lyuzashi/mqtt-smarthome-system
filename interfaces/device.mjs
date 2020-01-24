import vm from 'vm';
import Readable from '../system/common/readable';
// import Characteristic from '../../system/common/characteristic';

export default class Device extends Readable {
  constructor({ id, mode, characteristics }) {
    super();
    Object.assign(this, characteristics);
  }

  previousValue = undefined;

  // This will be in Readable class
  // async *read() {
    // Async generator to await next event (all characteristics)
  // }


  write() {
    // Delegate data to protocol
  }

  // Request current status from protocol
  get({ live, characteristic }) {
    // this.methods.find(method => method.type === 'get)
    // Retrieve latest cached value and callback with refresh method
    // Option (live) to return promise which waits for status with timeout?
    // const data = await pin.read();
    // this.status(data);
  }

  // Pass data through characteristic and trigger write
  set({ data, characteristic }) {

  }


  // Publish status to MQTT (via pushing message to readable)
  status(data) {
    console.dir(this.characteristics, { depth: null });
    this.characteristics.forEach(({ logic = [{ name: 'raw' }], methods, type }) => {

    });
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