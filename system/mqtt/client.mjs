import EventEmitter from 'events';

export default class Client extends EventEmitter {

  constructor() {
    super();
    process.on('message', message => {
      if (message.system !== 'mqtt') return;
      switch (message.method) {
        case 'message':
          this.emit('message', ...message.args);
        break;
      }
    });
  }

  connect() {
    this.emit('connect');
    return this;
  }

  publish(topic, payload, options) {
    console.log(!!process.send, '🐬 process calling publish', arguments);
    return process.send({ system: 'mqtt', method: 'publish', args: [topic, payload, options] })
  }
}