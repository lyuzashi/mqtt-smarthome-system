import web from './system/web'

import http from 'http';
import express from "express";
import RED from "node-red";

import expressWebSocket from 'express-ws';

import { start, context } from './system/shell';


start();


// Create an Express app
var app = express();
var app2 = express();

// Add a simple route for static content served from 'public'
// app.use("/",express.static("public"));

// Create a server
var server = http.createServer(app);
var server2 = http.createServer(app2);



const wsInstance = expressWebSocket(app2, null, {
  leaveRouterUntouched: true,
  wsOptions: {
    perMessageDeflate: false,
    noServer: true,
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


// app.ws(settings.httpAdminRoot,RED.httpAdmin);




server.listen(8080);

// Start the runtime
RED.start();