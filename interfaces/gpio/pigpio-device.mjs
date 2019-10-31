import GPIO from './gpio';

export default class PIGPIO extends GPIO {
  constructor(options) {
    super(options);
    Object.assign(this, {
      ...options,
      protocol: options.protocol.find(({ type }) => type === 'pigpio'),
      interface: options.interface.find(({ type }) => type === 'gpio'),
    });

    this.init();
  }

  async init() {
    await this.client.ready;
    this.pin = this.client.gpio(this.id);
    this.pin.modeSet(this.interface.mode);
    this.pin.notify(this.edge);
    setTimeout(() => {
      this.edge(1, Date.now())
    }, 2000);
    console.dir(this, { depth: null})
  }

  edge(level, tick) {
    this.status(level);
  }
}