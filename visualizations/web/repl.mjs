import websocket from 'websocket-stream/stream';
import { start } from '../../system/shell';
import { app } from './ws';

app.ws('/repl', function(ws, req) {
  const stream = websocket(ws, { binary: true });
  const repl = start({ input: stream, output: stream });
});
