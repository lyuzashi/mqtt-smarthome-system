import { Duplex } from 'stream';


// Protocol for light must write to characteristics if they change on the device and handle write
// requests 

export default class FirmataLight extends Duplex {
  constructor({ device, protocol, ...options }) {
    super({ objectMode: true });
    Object.assign(this, { device, protocol });
    protocol.on('ready', () => this.setup(device));
    device.driver.then(driver => Object.assign(this, { driver }))
  }

  ready = false;

  channelValues = new Map();

  setup() {
    // TODO handle multiple pins for multi-color device
    // default channel is brightness
    this.protocol.pinMode(this.device.id, this.protocol.MODES.PWM);

    this.push({ channel: 'online', value: true }); 
    this.ready = true;
  }
  
  _write({ channel, value, request }, encoding, callback) {
    if (this.ready) {
      switch (channel) {
        case 'brightness':
          // TODO transitions, special functions and cases etc
          if (!request) {
            this.protocol.analogWrite(this.device.id, value * 1024);
            this.channelValues.set(channel, value);
          }
          // Publish status since Firmata is write-only for PWM
          this.push({ channel, value: this.channelValues.get(channel) }); 
        break;
      }
    }
    callback();
  }

  _read() {
    // Setup input listeners
  }

}