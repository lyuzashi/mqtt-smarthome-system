import Deferred from './deferred';

export default class MessageSlot {
  queue = new Set();

  next() {
    for (const [,message] of this.queue.entries()) {
      if (!message.settled) return message;
    }
    const message = new Deferred(this.queue);
    this.queue.add(message);
    return message;
  }

  write(data){
    this.next().resolve(data);
  }

  async *read() {
    while (true) {
      for (const [,message] of this.queue.entries()) {
        if (message.settled) {
          yield message.promise;
          this.queue.delete(message);
        }
      }
      await this.next().promise
    }
  }
}
