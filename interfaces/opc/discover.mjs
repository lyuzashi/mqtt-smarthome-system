const mdns = require('mdns');

const sequence = [
  mdns.rst.DNSServiceResolve(),
  'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo() : mdns.rst.getaddrinfo({families:[4]}),
  mdns.rst.makeAddressesUnique()
];
const browser = mdns.createBrowser(mdns.tcp('opc'), {resolverSequence: sequence});

browser.on('serviceUp', ({ name, host, prototype, addresses }) => {});
browser.on('serviceDown', ({ name, host, prototype, addresses }) => {});

browser.start();
