var natUpnp = require('nat-upnp');
 
var client = natUpnp.createClient();
 
client.portMapping({
  public: 12345,
  private: 54321,
  ttl: 10
}, function(err) {
  // Will be called once finished
});
 
client.portUnmapping({
  public: 12345
});
 
client.getMappings(function(err, results) {
});
 
client.getMappings({ local: true }, function(err, results) {
});
 
client.externalIp(function(err, ip) {
});