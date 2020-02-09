
import transform from './characteristic-logic';
import { Duplex } from 'stream';
import mqtt from '../mqtt'

const castType = ({ type, value }) => {
  switch(type) {
    case 'float':
      return parseFloat(value, 10);
    break;
  }
}

export default class Characteristic extends Duplex {
  constructor({ name, type, methods = [], logic = [{ name: 'raw' }], device, retain = true }) {
    super({ objectMode: true });
    Object.assign(this, { name, type, methods, logic, device, retain });

  }

  _write(chunk, encoding, callback) {
    // Update status
    // TOOD transform based on 'type' e.g. float, int, string
    this.status(chunk);

    callback();
  }

  subbed = false;

  // Device reads from MQTT stream, so subscribe here and push on message
  _read() {
    if (this.subbed) return;
    this.subbed = true;
    // TODO prevent this being called again if already subscribed - memoize
    console.log('reading?', this.setMethods)
    this.setMethods.forEach(({ topic }) => {
      // TODO any transforming of raw data into a characteristic
      // at least handle typeing
      console.log('subscribing to', topic, this.type);
      var s = mqtt.subscribe(topic,  (topic, value) => {
        console.log('characteristic got value', value);
        this.push(castType({ type: this.type, value }));
      });
      console.log('🦁', s)
    });

  }


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

  get setMethods() {
    return this.methods.filter(({ method }) => method === 'set');
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
      retain: this.retain,
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