import REPL from 'repl';
import app from '../visualizations/web';
import expressWebSocket from 'express-ws';
import websocket from 'websocket-stream/stream';
import convertNewline from 'convert-newline';

const newline = convertNewline('crlf').stream();

// extend express app with app.ws()
expressWebSocket(app, null, {
  // ws options here
  perMessageDeflate: false,
});

app.ws('/repl', function(ws, req) {
  // convert ws instance to stream
  const stream = websocket(ws, {
    // websocket-stream options here
    binary: true,
  });

  REPL.start({
    prompt: '> ',
    input: stream,
    output: newline,
    terminal: true,
  });

  newline.pipe(stream);
});

const repl = REPL.start({
  prompt: '> ',
});

export default repl;
