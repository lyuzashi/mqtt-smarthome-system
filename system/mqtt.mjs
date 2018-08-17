import Mosca from 'mosca';
import mDNS from './mdns';
import shutdown, { ignore } from './shutdown';

const server = new Mosca.Server();
server.servers.forEach(ignore);
ignore(server.logger.stream);
// There is also a socket and maybe a timer that is keeping the app alive

// server.on('clientConnected', function(client) {
//     console.log('client connected', client.id);
// });

// fired when a message is received
// server.on('published', function(packet, client) {
//   console.log('Published', packet.payload);
// });

server.on('ready', () => {
  console.log('Mosca server is up and running');
   // advertise an HTTP server on port 3000
  const service = mDNS.publish({ name: 'HAL9000', type: 'mqtt', port: 1883 });
  server.on('closed', () => {
    // Register this for mqtt termination
    service.stop();
  }); 
  shutdown.on('exit', () => {
    server.close();
  })
});

export default server;
