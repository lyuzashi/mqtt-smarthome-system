import Readable from '../../common/system/readable';
import Characteristic from '../../system/common/characteristic';

// TODO extend device
export default class GPIO extends Readable {
  constructor({ id, mode, characteristics, register }) {
    super();
    Object.assign(this, { characteristics });
    register(this);
  }

  previousValue = undefined;

  // This will be in Readable class
  // async *read() {
    // Async generator to await next event (all characteristics)
  // }


  write() {
    // Delegate data to protocol after passing through characteristic handling
  }


  // read() streams updates as topic+data... should this be on each characteristic?

  // Publish status to characteristics
  status(data) {
    console.dir(this.characteristics, { depth: null });
    this.characteristics.forEach(({ logic = [{ name: 'raw' }], methods, type }) => {

    });
  }
}