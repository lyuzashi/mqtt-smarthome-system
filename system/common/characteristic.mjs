
import transform from './characteristic-logic';
import { Duplex } from 'stream';
import mqtt from '../mqtt'

export default class Characteristic extends Duplex {
  constructor({ name, type, methods = [], logic = [{ name: 'raw' }], device }) {
    super({ objectMode: true });
    Object.assign(this, { name, type, methods, logic, device });
  }


  _write(chunk, encoding, callback) {
    // Update status
    // TOOD transform based on 'type' e.g. float, int, string
    this.status(chunk);

    callback();
  }

  // read() - inherited for streaming changes 

  // Transforms data and calls device.write
  // set(data) {

  // }

  // Request current status from protocol. Might call device.write
  // get({ live, characteristic }) {
  //   // this.methods.find(method => method.type === 'get)
  //   // Retrieve latest cached value and callback with refresh method
  //   // Option (live) to return promise which waits for status with timeout?
  //   // const data = await pin.read();
  //   // this.status(data);
  // }

  // TODO memoize
  get statusMethods() {
    return this.methods.filter(({ method }) => method === 'status');
  }

  // Set status of characteristic 
  status(data) {
    this.statusMethods.forEach(({ topic, type }) => {
      let transformedQueueAtEnd = true;
      let transformedData = data;
      for (const options of this.logic) {
        ({ 
          data: transformedData = transformedData, 
          queueAtEnd: transformedQueueAtEnd = transformedQueueAtEnd 
        } = transform({
          options,
          type,
          topic,
          data: transformedData,
          previousValue: this.previousValue,
          enqueue: this.enqueue.bind(this),
          queueAtEnd: transformedQueueAtEnd
        }));
      }
      if (transformedQueueAtEnd) {
        this.enqueue({ topic, payload: data });
      }
    });
  }

  enqueue({ topic, payload }) {
    mqtt.publish({
      topic,
      payload: String(payload),
      retain: true,
    });
  }

  // Records methods and topics, previous value and handles transforming

  // { name: 'ContinuousMotion',
  // type: 'boolean',
  // methods:
  //  [ { method: 'status',
  //      topic: 'motion/status/Bedroom Motion Sensor/ContinuousMotion' },
  //    { method: 'get',
  //      topic: 'motion/get/Bedroom Motion Sensor/ContinuousMotion' } ],
  // logic: [ { name: 'raw' }, { name: 'retrigger', delay: 5000 } ] } ]
}