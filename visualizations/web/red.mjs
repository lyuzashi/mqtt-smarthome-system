import http from 'http';
import websocketUrlDefault from 'express-ws/lib/websocket-url';
import RED from '../../system/red';
import { app, server, wsInstance } from './ws';

const websocketUrl = websocketUrlDefault.default;

// import server from './ssl';
// import app from '../../system/web';

// TODO set useServer to false when importing app 

app.use(RED.settings.httpAdminRoot, RED.httpAdmin);

app.use(RED.settings.httpNodeRoot, RED.httpNode);


// Can getWss be patched to trigger useServer = false?
const wss = wsInstance.getWss();


// Patch websocket upgrade handler for express-ws
RED.server.on('upgrade', (request, socket, head) => {
  console.log('🌂 upgrade', request.url);
  const url = websocketUrl(request.url);
  if (app._router.stack
    .filter(({ route }) => route && route.path && Object.keys(route.methods).length)
    .map(({ route }) => route.path)
    .find(path => path === url)) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      const response = new http.ServerResponse(request);
      Object.assign(request, { url, ws });
      app.handle(request, response);
    })
  }
})

app.use('/red/*', (req, res) => {
  res.end();
});
