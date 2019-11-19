import RED from '../../system/red';
import { app, server } from './ws';
// import server from './ssl';
// import app from '../../system/web';

// TODO set useServer to false when importing app 

app.use(RED.settings.httpAdminRoot, RED.httpAdmin);

app.use(RED.settings.httpNodeRoot, RED.httpNode);

app.use('/red/*', (req, res) => {
  res.end();
});
