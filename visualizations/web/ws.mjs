import expressWebSocket from 'express-ws';
import app from '../../system/web';
import server from './ssl';

// How to export this and provide the option?
// Needed for importing via red or without, so each operates independently
// Use a self involking function which is exported twice with two options curried
// and rely on module caching


const wsServer = useServer ? server : null;

const wsInstance = expressWebSocket(app, wsServer, {
  wsOptions: {
    perMessageDeflate: false,
  }
});


export { app, server, wsInstance };
