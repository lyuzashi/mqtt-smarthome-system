import REPL from 'repl';
import app from '../visualizations/web';
import expressWebSocket from 'express-ws';
import websocket from 'websocket-stream/stream';
import convertNewline from 'convert-newline';

const context = {};
const newline = convertNewline('crlf').stream();

expressWebSocket(app, null, {
  perMessageDeflate: false,
});

app.ws('/repl', function(ws, req) {
  const stream = websocket(ws, { binary: true });

  const repl = REPL.start({
    prompt: '> ',
    input: stream,
    output: newline,
    terminal: true,
  });

  Object.assign(repl.context, context);

  newline.pipe(stream);
});

export default context;
