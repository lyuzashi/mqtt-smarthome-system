import RED from 'node-red';
import debug from 'debug';



// Initialise the runtime with a server and settings
RED.init({
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