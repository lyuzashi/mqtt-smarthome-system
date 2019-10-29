import RED from 'node-red';

// Initialise the runtime with a server and settings
RED.init({
  httpAdminRoot:"/red",
  httpNodeRoot: "/api",
  userDir:".nodered/",
  functionGlobalContext: { }    // enables global context
});

// Start the runtime
RED.start();

export default RED;