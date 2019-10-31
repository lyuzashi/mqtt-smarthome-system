import pigpioClient from 'pigpio-client';
import Deferred from '../../system/common/deferred';

const { pigpio } = pigpioClient;

export default class PigpioClient {
  constructor(options) {
    const client = pigpio(options);
    Object.assign(this, client);
    client.once('connected', this.readyDeferred.resolve);
    client.once('error', this.readyDeferred.reject);
  }

  readyDeferred = new Deferred();

  ready = this.readyDeferred.promise;
}

