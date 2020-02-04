import MessageSlot from './message-slot';

export default class Readable {
  slots = new Set();

  enqueue (payload){
    for (const [,slot] of this.slots.entries()) {
      slot.write(payload);
    }
  }

  read() {
    const slot = new MessageSlot;
    this.slots.add(slot);
    return slot.read();
  };
}

