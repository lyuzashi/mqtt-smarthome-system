import bug from 'debug';
import { Duplex } from 'stream';
import Server from './server';
import Client from './client';
import os from 'os';
import net from 'net';
import app from '../web';
import mdns from 'mdns';
import shutdown from '../shutdown';
import { context } from '../shell';

const port = 1883;

const debug = bug('smarthome:mqtt');
const isChildProcess = !!process.send;
const service = mdns.createAdvertisement(mdns.tcp('mqtt'), port);

export default (() => {
  if (isChildProcess) {
    const pipe = new net.Socket({ fd: 3 });
    return new Client(pipe);
  } else {
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
    const stream = new Duplex();
    const client = new Client(stream);
    server.handle(stream);
    context.mqtt = client;
    return client;
  }

})();
