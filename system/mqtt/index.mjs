import bug from 'debug';
import Server from './mosca-server';
import Client from './client';
import os from 'os';
import app from '../web';
import mdns from 'mdns';
import shutdown from '../shutdown';
import { context } from '../shell';

const debug = bug('smarthome:mqtt');
const isChildProcess = !!process.send;
const service = mdns.createAdvertisement(mdns.tcp('mqtt'), 1883);

export default (() => {
  if (isChildProcess) {
    return new Client();
  } else {
    const server = new Server();
    server.on('ready', () => {
      debug('Mosca server listening on %d', server.servers[0].address().port);
      service.start();
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
