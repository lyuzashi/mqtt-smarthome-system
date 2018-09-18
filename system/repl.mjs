import REPL from 'repl';

import http from 'http';


import websocket from 'websocket-stream';


const server = http.createServer().listen(3000);
var wss = websocket.createServer({server}, handle)

function handle(stream, request) {
  // `request` is the upgrade request sent by the client.
  REPL.start({
    prompt: '> ',
    input: stream,
    output: stream,
    terminal: true,
  });
}
const repl = REPL.start({
  prompt: '> ',
});

export default repl;
