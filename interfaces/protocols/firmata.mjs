import Firmata from 'firmata';

export default class FirmataProtocol extends Firmata {
  constructor({ protocol, device }) {
    super(protocol);
    Object.assign(this, { device });
  }
}

FirmataProtocol.perHub = true;
