import Mosca from 'mosca';
import os from 'os';
import mDNS from '../mdns';
import shutdown from '../shutdown';
import { context } from '../shell';

const isChildProcess = !!process.send;

export default (() => {
  // if not isChildProcess, return mosca server (maybe with extensions to handle
  // forwarding messages to children and special publish signature so the single instance can act as
  // a client within the parent process)
  // OTHERWISE return a client-like object with 
})();

// ALSO export an attachToProcess method to add childProcess.send and childProcess.on handlers
// Which will have to add events to server that must be removed on exit

// if (!process.send) // don't open server
const server = new Mosca.Server();

if (!server.isClient) {
  // server.on('clientConnected', function(client) {
  //     console.log('client connected', client.id);
  // });

  // Translate publishing to message events for client usage
  // server.on('published', packet => {
  //   const { topic, payload, ...msg } = packet;
  //   server.emit('message', topic, payload, msg);
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

  // Stub .connect function

  context.mqtt = server;
}

const attachToProcess = (childProcess) => {

}

export default server;
