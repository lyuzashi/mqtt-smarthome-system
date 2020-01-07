import EtherPort from 'etherport-client';

const { EtherPortClient } = EtherPort;

export default class EtherPortClientDevice extends EtherPortClient {
  constructor({ hub }) {
    super({ host: hub, port: 3030 });
  }
}
