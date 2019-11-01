import MessageSlot from './common/message-slot';

export default class Readable {
  slots = new Set();

  enqueue ({ topic, payload }){
    for (const [,slot] of this.slots.entries()) {
      slot.write({ topic, payload });
    }
  }

  read() {
    const slot = new MessageSlot;
    this.slots.add(slot);
    return slot.read();
  };
}

