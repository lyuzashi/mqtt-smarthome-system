import Aedes from 'aedes';

export default class Client extends Aedes.Client {

  subscriptions = new WeakMap();

  publish(packet, callback, options) {
    if ('string' === typeof packet) {
      const topic = packet;
      const payload = new Buffer(callback);
      return super.publish({ topic, payload, ...options });
    }
    return super.publish(packet, callback);
  }

  subscribe(topic, func, done) {
    if(this.subscriptions && !done) {
      const handler = ({ payload }, callback) => {
        func(topic, payload);
        callback();
      }
      this.subscriptions.set(func, handler);
      return super.subscribe(topic, handler);
    }
    return super.subscribe(topic, func, done);
  }

  unsubscribe(topic, func, done) {
    if(this.subscriptions) {
      const handler = this.subscriptions.get(func);
      return super.unsubscribe(topic, handler, done);
    }
    return super.unsubscribe(topic, func, done);
  }
}

// import EventEmitter from 'events';
// import deserialise from './deserialise';

// export default class Client extends EventEmitter {

//   constructor() {
//     super();
//     process.on('message', message => {
//       if (message.system !== 'mqtt') return;
//       switch (message.method) {
//         case 'message':
//           const { topic, payload, msg } = message;
//           this.emit('message', topic, `${deserialise(payload)}`, msg);
//         break;
//       }
//     });
//   }

//   connect() {
//     return this;
//   }

//   publish(topic, payload, options) {
//     return process.send({ system: 'mqtt', method: 'publish', topic, payload, options })
//   }
// }