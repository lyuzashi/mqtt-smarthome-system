import { Transform } from 'stream';
import objectPath from 'object-path';

export default class OverlandProtocol extends Transform {
  constructor({ payload, device }) {
    super({ objectMode: true });
    Object.assign(this, { payload, device });
  }

  _transform(chunk, encoding, callback) {
    const { device_id } = chunk.properties;
    if (device_id !== this.device.id) {
      // TODO is this the correct way to discard a chunk?
      return callback();
    } 
    if (this.payload) {
      this.push(objectPath.get(chunk, this.payload))
    } else {
      this.push(chunk);
    }
    callback();
  }

}