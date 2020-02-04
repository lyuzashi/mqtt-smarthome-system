import Readable from '../../system/common/readable';

export default class OverlandProtocol extends Readable {
  constructor() {
    super();
    this.handleProtocol();
  }

  async handleProtocol() {
    for await (const payload of this.protocol.read()) {
      console.log('New payload', payload);
      // TODO pass through overland protocol?
    }
  }

}