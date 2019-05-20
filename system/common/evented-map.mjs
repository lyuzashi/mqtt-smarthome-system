import EventEmitter from 'events';
import mapper from './mapper';

export default class EventedMap extends EventEmitter {
  constructor(iterable) {
    super();
    this.store = new Map(iterable);
    this.maps = {};
  }

  map(key, maps) {
    this.maps[key] = maps;
  }

  mapped(key, value) {
    const map = this.maps[key];
    return mapper(map, value);
  }

  clear() {
    this.store.clear();
  }

  delete(key) {
    return this.store.delete(key);
  }

  get(key) {
    return this.mapped(key, this.store.get(key));
  }

  has(key) {
    return this.store.has(key);
  }

  keys() {
    return this.store.keys();
  }

  set(key, value) {
    const stringValue = typeof value === 'object' ? value : String(value); // HERE!
    this.emit(key, this.mapped(key, stringValue));
    return this.store.set(key, stringValue);
  }

  values() {
    return this.store.values(); // perform mapping here?
  }

  [Symbol.iterator]() {
    return this.store[Symbol.iterator];
  }

  // set raw values, get back mapped values
  // emit events when values are set, returning their mapped value



}