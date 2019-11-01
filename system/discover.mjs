import mdns from 'mdns';
import Deferred from './common/deferred';

class DeferredQueue extends Deferred {
  constructor (queue) {
    super();
    queue.add(this);
  }
}

class Discover {
  constructor (protocol) {
    this.queue = new Set();
    this.protocol = protocol;
    this.browser = mdns.createBrowser(mdns.tcp(this.protocol), {
      resolverSequence: Discover.sequence
    });
    this.browser.start();

    this.browser.on('serviceUp', ({ name, host, port, addresses }) => {
      this.nextMessageSlot().resolve({ name, host, port, addresses });
    });
    Discover.protocols.set(this.protocol, this);
  }

  static start(protocol) {
    return Discover.protocols.get(protocol) || new Discover(protocol);
  }

  nextMessageSlot() {
    for (const [,message] of this.queue.entries()) {
      if (!message.settled) return message;
    }
    return new DeferredQueue(this.queue);
  }
}

Discover.protocols = new Map();

Discover.sequence = [
  mdns.rst.DNSServiceResolve(),
  'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo() : mdns.rst.getaddrinfo({families:[4]}),
  mdns.rst.makeAddressesUnique()
];

export default async function* (protocol) {
  const discover = Discover.start(protocol);
  for (const [,message] of discover.queue.entries()) {
    if (message.settled) {
      yield message.promise;
    }
  }
  yield discover.nextMessageSlot().promise;
};

