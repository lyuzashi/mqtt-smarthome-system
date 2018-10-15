import Server from './mosca-server';
import os from 'os';
import mDNS from './mdns';
import shutdown from './shutdown';
import { context } from './shell';

const server = new Server();

// server.on('clientConnected', function(client) {
//     console.log('client connected', client.id);
// });

// Translate publishing to message events for client usage
server.on('published', packet => {
  const { topic, payload, ...msg } = packet;
  server.emit('message', topic, payload, msg);
});

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

// Stub .connect function

context.mqtt = server;
export default server;
