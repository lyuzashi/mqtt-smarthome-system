import { ChildProcess } from 'child_process';
import EventEmitter from 'events';
import mqtt from './';
/*
MQTT Client-like module with direct connection to server.
Currently subscribes are ignored and all topics are received.
Works with Inter-process communication.
*/

export default class Client extends EventEmitter {
  constructor(childProcess) {
    super();
    if (childProcess instanceof ChildProcess) {
      // Wire up IPC server
      this.child = childProcess;
      childProcess.on('message', message => {
        if (message.system !== 'mqtt') return;
        switch (message.method) {
          case 'publish':
            this.publish(...message.args);
          break;
        }
      });
      childProcess.on('exit', this.close);
    }
    if (process.send) {
      // Is a child process, wire up IPC client
      process.on('message', message => {
        if (message.system !== 'mqtt') return;
        switch (message.method) {
          case 'message':
            this.emit('message', ...message.args);
          break;
        }
      });
    }
    mqtt.on('published', this.published);
  }

  get isClient() { return true; }

  close() {
    mqtt.off('published', this.published);
  }

  published(packet) {
    const { topic, payload, ...msg } = packet;
    this.emit('message', topic, payload, msg);
    if (this.child) {
      this.child.send({ system: 'mqtt', method: 'message', args: [topic, payload, msg] });
    }
  }

  publish(topic, payload, options) {
    if (process.send) {
      return process.send({ system: 'mqtt', method: 'publish', args: [topic, payload, options] })
    } else {
      return mqtt.publish({ topic, payload, ...options });
    }
  }
}