import Mosca from 'mosca';

export default class Server extends Mosca.Server {
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