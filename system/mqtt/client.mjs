import mqtt from 'mqtt';
import MQTTEmitter from 'mqtt-emitter';
import fs from 'fs';

/*
Distributors are unique for each subscription on the server to allow unsubscribing without affecting
other listeners to the same topic.
*/

export default class Client {

  events = new MQTTEmitter();
  subscriptions = new WeakMap();
  distributors = new WeakMap();
  
  constructor({ server }) {
    if (server) {
      // In-process server
      // This subscribes to all...
      // server.on('publish', ({ topic, payload }) => this.events.emit(topic, payload));
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
  }

  handle(...args) {
    if (this.server) return this.server.handle.apply(this.server, args);
  }

  subscribe(subscriptionTopic, callback) {
    if (this.server) {
      const distributeMessage = ({ topic, payload }) => this.events.emit(topic, payload);
      this.server.subscribe(subscriptionTopic, distributeMessage);
      this.distributors.set(callback, distributeMessage);
    }
    if (this.client) this.client.subscribe(subscriptionTopic);
    const handler = (payload, params, topic, topic_pattern) => callback(topic, payload);
    this.subscriptions.set(callback, handler);
    this.events.on(subscriptionTopic, callback);
  }

  unsubscribe(subscriptionTopic, callback) {
    if (this.server) {
      const distributeMessage = this.distributors.get(callback);
      if (distributeMessage) this.server.unsubscribe(subscriptionTopic, distributeMessage);
      this.distributors.delete(callback);
    }
    // On a client this would unsubscribe other listners to this topic
    if (this.client) this.client.unsubscribe(subscriptionTopic);
    const handler = this.subscriptions.get(callback);
    this.subscriptions.delete(callback);
    this.events.off(handler);
  }

  publish(topic, payload, options) {
    if (this.server) this.server.publish({ topic,  payload, ...options });
    if (this.client) this.client.publish({ topic, message: payload, ...options });
  }

}
