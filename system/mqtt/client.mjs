import mqtt from 'mqtt';
import MQTTEmitter from 'mqtt-emitter';
import fs from 'fs';
import { topicCast } from '../devices';

/*
Distributors are unique for each subscription on the server to allow unsubscribing without affecting
other listeners to the same topic.
*/

export default class Client {
  
  constructor({ server } = {}) {
    const events = new MQTTEmitter();
    const subscriptions = new WeakMap();
    const distributors = new WeakMap();
    if (server) {
      // In-process server
      Object.assign(this, { server });
    } else if (process.title === 'browser') {
      // Websockets
      const url = new URL('/mqtt', window.location.href);
      url.protocol = url.protocol.match(/s:$/) ? 'wss' : 'ws';
      const client = mqtt.connect(url.href);
      Object.assign(this, { client });
    } else if (fs.fstatSync(4).isSocket()) {
      // Child process with IPC socket
      const client = new mqtt.Client(() => new net.Socket({ fd: 4, readable: true, writable: true }), {});
      Object.assign(this, { client });
    }
    if (this.client) {
      this.client.on('message', (topic, payload) => this.events.emit(topic, payload));
    }
    Object.assign(this, { events, subscriptions, distributors })
  }

  handle(...args) {
    if (this.server) return this.server.handle.apply(this.server, args);
  }

  transform(topic, payload, callback) {
    const type = topicCast.get(topic);

    switch(type) {
      case 'float':
        return callback(parseFloat(payload, 10));
      break;
    }

    callback(payload);
  }

  subscribe(subscriptionTopic, callback) {
    if (this.server) {
      const distributeMessage = ({ topic, payload }, next) => next(this.events.emit(topic, payload));
      this.server.subscribe(subscriptionTopic, distributeMessage);
      this.distributors.set(callback, distributeMessage);
    }
    if (this.client) this.client.subscribe(subscriptionTopic);
    const handler = (payload, params, topic, topic_pattern) => this.transform(topic, payload, callback);
    this.subscriptions.set(callback, handler);
    this.events.on(subscriptionTopic, handler);
  }

  unsubscribe(subscriptionTopic, callback) {
    if (this.server) {
      const distributeMessage = this.distributors.get(callback);
      if (distributeMessage) this.server.unsubscribe(subscriptionTopic, distributeMessage);
      this.distributors.delete(callback);
    }
    // On a client this would unsubscribe other listeners to this topic
    if (this.client) this.client.unsubscribe(subscriptionTopic);
    const handler = this.subscriptions.get(callback);
    this.subscriptions.delete(callback);
    this.events.removeListener(subscriptionTopic, handler);
  }

  publish(topicPacket, payloadInline, optionsInline) {
    const { topic, payload, ...options } = 'object' === typeof topicPacket ? topicPacket :
    { topic: topicPacket, payload: payloadInline, ...optionsInline };

    // TODO generate buffer conditionally, don't transform existing buffers, and handle numbers specially

    if (this.server) this.server.publish({ topic, payload: Buffer.from(String(payload)), ...options });
    if (this.client) this.client.publish({ topic, message: Buffer.from(String(payload)), ...options });
  }

}
