import EtherPort from 'etherport-client';

const { EtherPortClient } = EtherPort;

export default class EtherPortClientProtocol extends EtherPortClient {
  constructor({ hub, port, device }) {
    super({ host: hub, port });
  }
}

EtherPortClientProtocol.perHub = true;
