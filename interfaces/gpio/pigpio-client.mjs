import pigpioClient from 'pigpio-client';

const { pigpio } = pigpioClient;

export default class PigpioClient {
  constructor(options) {
    const client = pigpio(options);
    this.ready = new Promise((resolve, reject) => {
      client.once('connected', resolve);
      client.once('error', reject);
    });
  }
}

