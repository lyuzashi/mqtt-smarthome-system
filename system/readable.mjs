import Deferred from './common/deferred';

class DeferredQueue extends Deferred {
  constructor (queue) {
    super();
    queue.add(this);
  }
}

export default class Readable {
  constructor () {
    this.queue = new Set();
  }

  nextMessageSlot() {
    for (const [,message] of this.queue.entries()) {
      if (!message.settled) return message;
    }
    return new DeferredQueue(this.queue);
  }

  enqueue ({ topic, payload }){
    console.log('queue', topic, payload, this.queue);
    this.nextMessageSlot().resolve({ topic, payload });
  }

  async *read() {
    for (const message of this.queue.entries()) {
      if (message.settled) {
        yield message.promise;
      }
    }
    yield this.nextMessageSlot().promise;
  };
}

