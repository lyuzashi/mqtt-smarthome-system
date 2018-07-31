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

export const getMappings = () =>
  getAllMappings().then(mappings =>
    mappings.filter(({ description }) =>
      description.startsWith(descriptionPrefix)));

const portMapping = promisify(client.portMapping.bind(client));

const mapPort = (port = randomPort()) => portMapping({
  public: port,
  private: port,
  ttl: 60,
  description: `${descriptionPrefix} ${randomId()}`
});
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

// mapPort().then(console.log, console.warn);

// getAllMappings().then(console.log);

// export default Promise.all([ getIpAddress, getPort ]).then(([ip, port]) => ({ ip, port }));
 
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
 
