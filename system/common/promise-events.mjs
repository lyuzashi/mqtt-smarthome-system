import EventEmitter from 'events';

export default class PromiseEventEmitter extends EventEmitter {
  emit(type, ...args) {
    const events = super.listeners(type);
    if (type === 'error' || events.length <= 0) return super.emit(type, ...args);
    return Promise.all(events.map(event => Reflect.apply(event, this, args)));
  }
};
