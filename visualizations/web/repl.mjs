import expressWebSocket from 'express-ws';
import websocket from 'websocket-stream/stream';
import { start } from '../../system/shell';
import app from '../../system/web';
import server from './ssl';

expressWebSocket(app, server, { perMessageDeflate: false });

app.ws('/repl', function(ws, req) {
  const stream = websocket(ws, { binary: true });
  const repl = start({ input: stream, output: stream });
});
