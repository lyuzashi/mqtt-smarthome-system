var mosca = require('mosca');

var server = new mosca.Server({
  interfaces: [ ] //  list of network interfaces with necessary options. - IP and socket?
  // Other interfaces can connect directly to socket, exposed on tcp port for Tasmota etc.
});

/*
 * Interface may contain following properties:
 *  - `type`, name of a build-in type or a custom type factory
 *  - `port`, target port, overrides default port infered from `type`
 *  - `host`, target host, overrides
 *
 * Built-in interface types:
 *  - `mqtt`, normal mqtt, port: 1883
 *  - `mqtts`, mqtt over ssl, port: 8883, requires `credentials`
 *  - `http`, mqtt over websocket, port: 3000
 *  - `https`, mqtt over secure websocket, port: 3001, requires `credentials`
 */

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('Published', packet.payload);
});

server.on('ready', setup);

server.on('closed', () => { }); // destroy mdns?

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}