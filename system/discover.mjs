import mdns from 'mdns';

const sequence = [
  mdns.rst.DNSServiceResolve(),
  'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo() : mdns.rst.getaddrinfo({families:[4]}),
  mdns.rst.makeAddressesUnique()
];

export default (protocol) => {
  const browser = mdns.createBrowser(mdns.tcp(protocol), { resolverSequence: sequence });

  browser.on('serviceUp', ({ name, host, prototype, addresses }) => {});
  browser.on('serviceDown', ({ name, host, prototype, addresses }) => {});
  
  browser.start();
  return browser;
}




// import { call, put } from 'redux-saga/effects';

// function* listen() {
//   yield (function* () {
//     let resolve;
//     let promise = new Promise(r => resolve = r); // The defer

//     socket.on('messages created', message => {
//       console.log('Someone created a message', message);
//       resolve(message); // Resolving the defer

//       promise = new Promise(r => resolve = r); // Recreate the defer for the next cycle
//     });

//     while (true) {
//       const message = yield promise; // Once the defer is resolved, message has some value
//       yield put({ type: 'SOCKET_MESSAGE', payload: [message] });
//     }
//   })();
// }

// export default function* root() {
//     yield call(listen);
// }

// for await (variable of iterable) {
//   statement
// }