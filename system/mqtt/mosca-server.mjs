// import Mosca from 'mosca';
import Aedes from 'aedes';
import Redis from 'aedes-persistence-redis';

export default class Server extends Aedes.Server {

  constructor(...opts) {
    super({
      // TODO replace with MongoDB Persistence on Memory
      persistence: Redis(),
    })
  //   super({
  //     backend: {
  //       type: 'redis',
  //     },
  //     persistence: {
  //       factory: Mosca.persistence.Redis
  //     }
  //   })
  //   // TODO merge ...opts
    // this.subscribe = this.subscribe.bind(this);
    // this.unsubscribe = this.unsubscribe.bind(this);
  }

  subscriptions = new WeakMap();
    
  connect() {
    this.emit('connect');
    return this;
  }

  publish(packet, client, callback) {
    if ('string' === typeof packet) {
      const topic = packet;
      const payload = client;
      const options = callback;
      return super.publish({ topic, payload, ...options });
    }
    return super.publish(packet, client, callback);
  }

  subscribe(topic, func, done) {
    if(this.subscriptions) {
      const handler = ({ payload }, callback) => {
        func(topic, payload);
        callback();
      }
      this.subscriptions.set(func, handler);
      return super.subscribe(topic, handler, done);
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