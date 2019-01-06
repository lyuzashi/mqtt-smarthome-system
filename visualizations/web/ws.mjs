import expressWebSocket from 'express-ws';
import app from '../../system/web';
import server from './ssl';

expressWebSocket(app, server, { perMessageDeflate: false });

export { app, server };
