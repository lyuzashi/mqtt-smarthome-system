import { Duplex } from 'stream';


export default class FirmataLight extends Duplex {
  constructor({ device, protocol, ...options }) {
    super({ objectMode: true });
    Object.assign(this, { device, protocol });
    protocol.on('ready', this.setup.bind(this));

  }

  setup() {
    // TODO handle multiple pins for multi-color device
    // default channel is brightness
    console.log('ready');
    this.protocol.pinMode(this.device.id, this.protocol.MODES.PWM);

    // this.analogWrite(this.device.id, level);

  }
  
  _write({ channel, value }, encoding, callback) {

    console.log('Write', value, 'to', channel, this.device.id);
    // this.characteristic.longitude.update(longitude);
    // this.characteristic.latitude.update(latitude);

  
    this.protocol.analogWrite(this.device.id, value * 1024);
    callback();
  }

}