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
    this.pin.notify(this.edge.bind(this));
    setTimeout(() => {
      this.edge(0, Date.now())
      // this.edge(1, Date.now())
      // this.edge(0, Date.now())
      // this.edge(1, Date.now())
    }, 500);
    setTimeout(() => {
      this.edge(1, Date.now())
    }, 1500);
  }

  edge(level, tick) {
    // Any further processing of raw data before it can be handled by GPIO class?
    this.status(level);
  }

  write() {
    this.pin.write()
  }

  read() {
    this.pin.read()
    // then this.status(data);
  }
}