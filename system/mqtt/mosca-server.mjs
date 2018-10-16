import Mosca from 'mosca';

let mqtt;

export default class Server {
  constructor({ client, ...opts}, callback) {
    if (client) {

    } else {
      if (!mqtt) mqtt = new Mosca.Server(opts, callback);
      return mqtt;
    }
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
      return mqtt.publish({ topic, payload, ...options });
    }
    return mqtt.publish(packet, client, callback);
  }
}