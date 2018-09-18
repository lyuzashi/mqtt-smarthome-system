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
  const stream = websocketStream(ws, {
    // websocket-stream options here
    binary: true,
  });

  console.log('opening', stream);

  REPL.start({
    prompt: '> ',
    input: stream,
    output: stream,
    terminal: true,
  });
});


// const server = http.createServer().listen(3000);
// var wss = websocket.createServer({server}, handle)

// function handle(stream, request) {
//   // `request` is the upgrade request sent by the client.
//   REPL.start({
//     prompt: '> ',
//     input: stream,
//     output: stream,
//     terminal: true,
//   });
// }
const repl = REPL.start({
  prompt: '> ',
});

export default repl;
