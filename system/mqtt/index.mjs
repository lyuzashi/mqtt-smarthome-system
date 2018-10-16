import Server from './mosca-server';
import Client from './client';
import os from 'os';
import mDNS from '../mdns';
import shutdown from '../shutdown';
import { context } from '../shell';

const isChildProcess = !!process.send;

export default (() => {
  if (isChildProcess) {
    // OTHERWISE return a client-like object with connection to parent process
    return new Client();
  } else {
    // if not isChildProcess, return mosca server (maybe with extensions to handle
    // forwarding messages to children and special publish signature so the single instance can act as
    // a client within the parent process)
    const server = new Server();

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

    context.mqtt = server;
    return server;
  }

})();
