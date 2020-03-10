import websocket from 'websocket-stream/stream';
import mqtt from '../../system/mqtt';
import { app } from './ws';

app.ws('/mqtt', (ws, req) => {
  const stream = websocket(ws, { binary: true });
  mqtt.handle(stream);
})

