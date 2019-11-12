/* Store array of things in keystore with an expiry for each */
import { get, set } from '../../config/keys';
import Deferred from '../common/deferred';
import { throws } from 'assert';

export const sixMonths = () => {
  const now = new Date();
  return now.setMonth(now.getMonth() + 6);
}

export default class ExpiringList {
  constructor({ name }) {
    Object.assign(this, {
      name,
      key: `expiring-list-${name}`,
    });
    this.load().then(() => this.clean());
  }

  data = new Set();
  expiries = new WeakMap();
  loadedDeferred = new Deferred();
  loaded = this.loadedDeferred.promise;

  async load() {
    const data = await get(this.key) || [];
    data.forEach(({ value, expiry }) => {
      this.data.add(value);
      this.expiries.set(value, expiry);
    });
    this.loadedDeferred.resolve();
  }

  async sync() {
    this.clean();
    const data = [...this.data].map(value => ({
      value,
      expiry: this.expiries.get(value),
    }));
    return set(this.key, data);
  }

  clean() {
    const time = Date.now();
    for (const [,item] of this.data.entries()) {
      const expiry = this.expiries.get(item);
      if (time > expiry) this.data.delete(item);
    }
  }

  *items () {
    this.clean();
    for (const [,item] of this.data.entries()) {
      yield item;
    }
  }

  expire(data, expires) {
    this.expiries.set(data, expires);
    this.clean();
  }

  add(value) {
    this.data.add(value);
    this.expiries.set(value, sixMonths());
    this.sync();
  }

}