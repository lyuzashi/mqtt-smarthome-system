import Mosca from 'mosca';
import os from 'os';
import mDNS from './mdns';
import shutdown from './shutdown';

const server = new Mosca.Server();

// server.on('clientConnected', function(client) {
//     console.log('client connected', client.id);
// });

// fired when a message is received
// server.on('published', function(packet, client) {
//   console.log('Published', packet);
// });

server.on('ready', () => {
  console.log('Mosca server is up and running');
   // advertise an HTTP server on port 3000
  const service = mDNS.publish({ name: os.hostname(), type: 'mqtt', port: 1883 });
  server.on('closed', () => {
    // Register this for mqtt termination
    service.stop();
  }); 
  shutdown.on('exit', () => {
    server.close();
  })
});

export default server;
