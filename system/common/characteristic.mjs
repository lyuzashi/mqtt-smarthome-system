
import { Duplex } from 'stream';
import truthy from 'truthy';
import transform from './characteristic-logic';
import mqtt from '../mqtt'

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
          if (this.lastValue === undefined && !this.written) {
            !this.statusUpdate(value);
          }
        }).catch(() => {
          // if (typeof default !== 'undefined') {
          //   // this.statusUpdate(default);
          // }
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


  castType = (value) => {
    const type = this.type;
    switch(type) {
      case 'float':
        return parseFloat(value, 10);
      case 'boolean':
        return truthy(value);
      break;
    }
  }
  
  packType = (value) => {
    const type = this.type;
    switch(type) {
      case 'boolean':
        return Buffer.from([truthy(value) ? 0x01 : 0x00]);
      break;
    }
    return String(value);
  }

  // Device notifies value to MQTT
  _write(chunk, encoding, callback) {
    this.written = true;
    this.statusMethods.forEach(({ topic, type }) => {
      mqtt.publish({
        topic,
        payload: this.packType(chunk),
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
    const payload = this.castType(value);
    return this.push(payload);
  }

  statusUpdate(value) {
    const payload = this.castType(value);
    this.lastValue = payload;
    return this.push(payload);
  }

}
