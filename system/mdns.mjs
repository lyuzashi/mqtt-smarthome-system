import Bonjour from 'bonjour';

const mDNS = Bonjour({
  // multicast: true // use udp multicasting
  // interface: '192.168.0.2' // explicitly specify a network interface. defaults to all
  // port: 5353, // set the udp port
  // ip: '224.0.0.251', // set the udp ip
  // ttl: 255, // set the multicast ttl
  // loopback: true, // receive your own packets
  // reuseAddr: true // set the reuseAddr option when creating the socket (requires node >=0.11.13)
});

// advertise an HTTP server on port 3000
const service = mDNS.publish({ name: 'My Web Server', type: 'http', port: 3000 });

// Register this for mqtt termination
service.stop();

// Register this for entire server termination (sigterm)
mDNS.unpublishAll();
mDNS.destroy();


export default mDNS;
