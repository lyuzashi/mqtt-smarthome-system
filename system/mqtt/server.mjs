import Aedes from 'aedes';
import Mongo from 'aedes-persistence-mongodb';

export default class Server extends Aedes.Server {
  constructor(...opts) {
    super({
      // TODO replace with MongoDB Persistence on Memory
      persistence: Mongo({ url: 'mongodb://127.0.0.1/aedes' }),
    })
  }

  // subscriptions = new WeakMap();
    
  // connect() {
  //   this.emit('connect');
  //   return this;
  // }

  // publish(packet, client, callback) {
  //   console.log('Publish', packet, client, !!callback)
  //   if ('string' === typeof packet) {
  //     const topic = packet;
  //     const payload = client;
  //     const options = callback;
  //     return super.publish({ topic, payload, ...options });
  //   }
  //   return super.publish(packet, client, callback);
  // }

  // subscribe(topic, func, done) {
  //   if(this.subscriptions && !done) {
  //     const handler = ({ payload }, callback) => {
  //       func(topic, payload);
  //       callback();
  //     }
  //     this.subscriptions.set(func, handler);
  //     return super.subscribe(topic, handler);
  //   }
  //   return super.subscribe(topic, func, done);
  // }

  // unsubscribe(topic, func, done) {
  //   if(this.subscriptions) {
  //     const handler = this.subscriptions.get(func);
  //     return super.unsubscribe(topic, handler, done);
  //   }
  //   return super.unsubscribe(topic, func, done);
  // }
}