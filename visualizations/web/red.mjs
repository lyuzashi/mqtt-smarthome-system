import RED from '../../system/red';
import server from './ssl';
import app from '../../system/web';

// Serve the editor UI from /red
app.use(RED.settings.httpAdminRoot,RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(RED.settings.httpNodeRoot,RED.httpNode);
