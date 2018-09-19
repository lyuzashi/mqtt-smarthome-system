import REPL from 'repl';
import app from '../visualizations/web';
import expressWebSocket from 'express-ws';
import http from 'http';


import websocket from 'websocket-stream/stream';

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
    output: stream,
    terminal: true,
  });
});


const repl = REPL.start({
  prompt: '> ',
});

export default repl;
