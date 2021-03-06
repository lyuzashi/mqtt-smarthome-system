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
    return new Client();
  } else {
    const server = new Server();
    const socket = net.createServer(server.handle);
    socket.listen(port, () => {
      debug('MQTT server listening on %d', port);
      service.start();
      server.on('closed', () => {
        service.stop();
      }); 
      shutdown.on('exit', () => {
        socket.close();
      })
    });
    return new Client({ server });;
  }

})();
