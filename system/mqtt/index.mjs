import bug from 'debug';
import Server from './mosca-server';
import Client from './client';
import os from 'os';
import net from 'net';
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
    const port = 1883;
    const server = new Server();
    const socket = net.createServer(server.handle);
    socket.listen(port, () => {
      debug('Mosca server listening on %d', port);
      service.start();
      server.on('closed', () => {
        service.stop();
      }); 
      shutdown.on('exit', () => {
        socket.close();
      })
    });
    context.mqtt = server;
    return server;
  }

})();
