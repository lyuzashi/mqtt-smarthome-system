import Readable from '../../system/readable';
import Characteristic from '../../system/common/characteristic';

export default class GPIO extends Readable {
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
}