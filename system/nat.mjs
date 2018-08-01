import natUpnp from 'nat-upnp';
import { randomBytes } from 'crypto';
import { promisify } from 'util';
import shutdown from './shutdown';
import { repo as descriptionPrefix } from './git/repository';
 
const portRange = ((start = 29170, end = 29998) =>
  Array.from({length: (end - start)}, (v, k) => k + start))();

const randomPort = () => portRange.splice(Math.floor(Math.random() * portRange.length), 1)[0];

const randomId = () => randomBytes(16).toString('hex');

const mappedPorts = new Map();

export const client = natUpnp.createClient();

shutdown.on('exit', client.close.bind(client));

export const getIpAddress = promisify(client.externalIp.bind(client));

const getAllMappings = promisify(client.getMappings.bind(client, { local: true }));

export const getMappings = ({ port: searchPort, description: searchDescription } = {}) =>
  getAllMappings().then(mappings =>
    mappings.filter(({ description, public: { port } }) =>
      description.startsWith(descriptionPrefix) &&
      (searchPort ? port === searchPort : true) &&
      (searchDescription ? description === searchDescription : true)
    ));

const portMapping = promisify(client.portMapping.bind(client));

const mapPort = (port = randomPort(), description = `${descriptionPrefix} ${randomId()}`) =>
  portMapping({
    public: port,
    private: port,
    ttl: 60, // After this period the rule will be deleted, even if client is still open. Requires a keepalive interval
    description,
  })
  .then(() => getMappings({ port, description }))
  .then(([successfulMapping]) => successfulMapping || Promise.reject(`Did not map ${description} to ${port}`))
  // The following should be placed in a wrapper which handles retried and keep alive
  .catch(() => {
    // Perform some kind of retry with another port
  })
  .then(({ ttl } => {
    // set interval for keep alive
  })
// Then check the same description exists

// export const getPort = 
// come up wioth random port in range
// send mapping
// get mappings and filter

// use uuid for description
// ensure it is dleted on exit
// look for mappings in namespace to delete first

// export const removePort = () => 

// export const tidyPorts = () => 

mapPort().then(console.log).catch(console.warn);

// getAllMappings().then(console.log);

// export default Promise.all([ getIpAddress, getPort ]).then(([ip, port]) => ({ ip, port }));
// What about when port changes or IP changes? Has to trigger a re-bind somehow
 
// client.portMapping({
//   public: 12345,
//   private: 54321,
//   ttl: 10
// }, function(err) {
//   // Will be called once finished
// });
 
// client.portUnmapping({
//   public: 12345
// });
 
// client.getMappings(function(err, results) {
// });
 
// client.getMappings({ local: true }, function(err, results) {
// });
 
