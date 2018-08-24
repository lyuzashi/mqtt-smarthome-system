// import EventEmitter from 'events';

// export default 
const EventEmitter = require('events');
module.exports = 
class Mapper extends EventEmitter {
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
    if (map) {
      return map[value] || value;
    }
    return value;
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
    this.emit(key, this.mapped(key, value));
    return this.store.set(key, value);
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