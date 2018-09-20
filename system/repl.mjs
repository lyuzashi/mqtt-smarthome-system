import REPL from 'repl';
import app from '../visualizations/web';
import expressWebSocket from 'express-ws';
import websocket from 'websocket-stream/stream';

const context = {};

expressWebSocket(app, null, {
  perMessageDeflate: false,
});

app.ws('/repl', function(ws, req) {
  const stream = websocket(ws, { binary: true });
  const repl = REPL.start({
    prompt: '> ',
    input: stream,
    output: stream,
    terminal: true,
  });
  Object.assign(repl.context, context);
  // TODO close on close
});

export default context;
