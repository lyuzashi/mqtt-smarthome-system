import Server from './mosca-server';
import Client from './client';
import os from 'os';
import app from '../web';
import mDNS from '../mdns';
import shutdown from '../shutdown';
import { context } from '../shell';

const isChildProcess = !!process.send;

export default (() => {
  if (isChildProcess) {
    return new Client();
  } else {
    const server = new Server();
    server.attachHttpServer(app, '/mqtt');
    server.on('ready', () => {
      console.log('Mosca server is up and running');
      const service = mDNS.publish({ name: os.hostname(), type: 'mqtt', port: 1883 });
      server.on('closed', () => {
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
