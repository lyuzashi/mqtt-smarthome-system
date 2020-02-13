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
  }

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
}