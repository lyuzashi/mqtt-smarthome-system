
import { Duplex } from 'stream';
import transform from './characteristic-logic';
import mqtt from '../mqtt'

const castType = ({ type, value }) => {
  switch(type) {
    case 'float':
      return parseFloat(value, 10);
    break;
  }
}

export default class Characteristic extends Duplex {
  subscriptions = new WeakMap();
  lastValue = undefined;
  written = false;

  constructor({ name, type, methods = [], logic = [{ name: 'raw' }], device, retain = true }) {
    super({ objectMode: true });
    Object.assign(this, { name, type, methods, logic, device, retain });

    // Handle get topics, informing device to retrieve value
    this.getMethods.forEach(method => {
      if (this.subscriptions.has(method)) return;
      const { topic } = method;
      const handler = () => this.emit('request');
      mqtt.subscribe(topic, handler);
      this.subscriptions.set(method, handler);
    });

    // If retain == true, on startup subscribe to status method to retrieve retained value then push
    // to device 
    if (retain == true) {
      this.statusMethods.forEach(({ topic }) => {
        mqtt.getRetained(topic).then(value => {
          console.log('Got new initial value', topic, value, this.lastValue, this.written);
          if (this.lastValue === undefined && !this.written) {
            !this.statusUpdate(value);
          }
        }).catch(() => {
          console.log('no initial value for', topic);
        })
      });
    }
  }

  get statusMethods() {
    return this._statusMethods || (this._statusMethods = this.methods.filter(({ method }) => method === 'status'));
  }

  get setMethods() {
    return this._setMethods || (this._setMethods = this.methods.filter(({ method }) => method === 'set'));
  }

  get getMethods() {
    return this._getMethods || (this._getMethods = this.methods.filter(({ method }) => method === 'get'));
  }

  // Device notifies value to MQTT
  _write(chunk, encoding, callback) {
    this.written = true;
    this.statusMethods.forEach(({ topic, type }) => {
      mqtt.publish({
        topic,
        payload: String(chunk),
        retain: this.retain,
      });
      this.lastValue = chunk;
    });
    callback();
  }

  // Device reads from MQTT stream, so subscribe here and push on message
  _read() {
    this.setMethods.forEach(method => {
      if (this.subscriptions.has(method)) return;
      const { topic } = method;
      const handler = (value) => {
        if (!this.statusUpdate(value)) {
          mqtt.unsubscribe(topic, handler);
        }
      }
      mqtt.subscribe(topic, handler);
      this.subscriptions.set(method, handler);
    });
  }

  update(value) {
    const payload = castType({ type: this.type, value });
    return this.push(payload);
  }

  statusUpdate(value) {
    const payload = castType({ type: this.type, value });
    this.lastValue = payload;
    return this.push(payload);
  }

}
