import EventEmitter from 'events';
import deserialise from './deserialise';

export default class Client extends EventEmitter {

  constructor() {
    super();
    process.on('message', message => {
      if (message.system !== 'mqtt') return;
      switch (message.method) {
        case 'message':
          const { topic, payload, msg } = message;
          this.emit('message', topic, deserialise(payload), msg);
        break;
      }
    });
  }

  connect() {
    return this;
  }

  publish(topic, payload, options) {
    return process.send({ system: 'mqtt', method: 'publish', topic, payload, options })
  }
}