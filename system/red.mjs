import RED from 'node-red';
import debug from 'debug';
import { server } from '../visualizations/web/ws';


// Initialise the runtime with a server and settings
RED.init(server, { // This works with interop
  httpAdminRoot:"/red",
  httpNodeRoot: "/api",
  userDir:".nodered/",
  functionGlobalContext: { },    // enables global context
  logging: {
    debug: {
      level: 'info',
      handler (settings) {
        const logger = debug('smarthome:logic:red');
        return ({ level, msg }) => {
          if (level > 30) logger(msg.trim(), level);
        }
      }
    }
  }
});

// Start the runtime
RED.start();

export default RED;