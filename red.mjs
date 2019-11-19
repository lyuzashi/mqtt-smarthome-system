import repl from 'repl';

import http from 'http';
import express from "express";
import RED from "node-red";

import expressWebSocket from 'express-ws';
import websocketUrlDefault from 'express-ws/lib/websocket-url';

const websocketUrl = websocketUrlDefault.default;




const { context } = repl.start();


// Create an Express app
var app = express();

// Add a simple route for static content served from 'public'
// app.use("/",express.static("public"));

// Create a server
var server = http.createServer(app);



const wsInstance = expressWebSocket(app, null, {
  // leaveRouterUntouched: true,
  wsOptions: {
    perMessageDeflate: false,
    // noServer: true,
  }
});

context.wsInstance = wsInstance;


wsInstance.getWss() 


// wsServer.on('connection', (socket, request) => {
//   request.url = websocketUrl(request.url);
// // Intercept here to no-op on non-matching URL rather than close?



// Create the settings object - see default settings.js file for other options
var settings = {
    httpAdminRoot:"/red",
    httpNodeRoot: "/api",
    userDir:".nodered/",
    functionGlobalContext: { }    // enables global context
};

// Initialise the runtime with a server and settings
RED.init(server,settings);

context.RED = RED;

// Serve the editor UI from /red
app.use(settings.httpAdminRoot,RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot,RED.httpNode);



RED.server.on('upgrade', (request, socket, head) => {
  const url = websocketUrl(request.url);
  if (app._router.stack
    .filter(({ route }) => route && route.path && Object.keys(route.methods).length)
    .map(({ route }) => route.path)
    .find(path => path === url)) {
    wsInstance.getWss().handleUpgrade(request, socket, head, (ws) => {
      const response = new http.ServerResponse(request);
      Object.assign(request, { url, ws });
      app.handle(request, response);
    })
  }
})

app.ws('/echo', function(ws, req) {
  console.log('Connecting to ws');
  ws.send('welcome');
  ws.on('message', function(msg) {
    console.log('☝️', msg);
    ws.send(msg);
  });
});


app.ws('/ya', function(ws, req) {
  console.log('con');
  ws.send('ok');
});

// app.ws(settings.httpAdminRoot,RED.httpAdmin);

context.app = app;


server.listen(8080);

// Start the runtime
RED.start();