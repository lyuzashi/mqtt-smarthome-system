import Firmata from 'firmata';
import Etherport from '../protocols/etherport-client';

// Communicate with Arduino devices with Johnny-Five.
// Aim is to use pigpio bitbang serial to remote neptr device 

const selectProtocol = (config) => {
  if (config.protocol[0].type === 'etherport-client') {
    return new Etherport(config);
  }
}

export default class FirmataDevice extends Firmata {
  constructor(config) {
    const protocol = selectProtocol(config);
    super(protocol);
    Object.assign(this, { config });
    this.on('ready', this.setup);
  }

  setup() {
    console.log('ready');
    this.pinMode(this.config.id, this.MODES.PWM);
    this.analogWrite(this.config.id, 0);
  }

  // deal with characteristics
}



// class Micro extends Device {

// }

// Dimmable - characteristic
// Light - characteristic
// Firmata
// Etherport
// Micro
// Device
// Writable