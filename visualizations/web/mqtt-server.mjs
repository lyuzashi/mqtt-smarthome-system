import Client from 'mosca/lib/client';
import Connection from 'mqtt-connection';
import websocket from 'websocket-stream/stream';
import mqtt from '../../system/mqtt';
import { app } from './ws';

app.ws('/mqtt', (ws, req) => {
  const stream = websocket(ws, { binary: true });
  const connection = new Connection(stream);
  new Client(connection, mqtt);
})

