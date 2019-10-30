import RED from '../../system/red';
import server from './ssl';
import app from '../../system/web';

app.use(RED.settings.httpAdminRoot, RED.httpAdmin);

app.use(RED.settings.httpNodeRoot, RED.httpNode);

app.use('/red/*', (req, res) => {
  res.end();
});
