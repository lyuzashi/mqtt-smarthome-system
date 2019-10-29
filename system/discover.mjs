import mdns from 'mdns';

class Deferred {
  constructor (queue) {
    this.resolved = false;
    this.rejected = false;
    this.settled = false;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.promise
      .then(() => this.resolved = true)
      .catch(() => this.rejected = true)
      .then(() => this.settled = true);
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

  nextMessageSlot() {
    for (const [,message] of this.queue.entries()) {
      if (!message.settled) return message;
    }
    return new Deferred(this.queue);
  }
}

Discover.protocols = new Map();

Discover.start = protocol => Discover.protocols.get(protocol) || new Discover(protocol);

Discover.sequence = [
  mdns.rst.DNSServiceResolve(),
  'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo() : mdns.rst.getaddrinfo({families:[4]}),
  mdns.rst.makeAddressesUnique()
];

export default async function* (protocol) {
  const discover = Discover.start(protocol);
  for (const message of discover.queue.entries()) {
    if (message.settled) {
      yield message.promise;
    }
  }
  yield discover.nextMessageSlot().promise;
};

