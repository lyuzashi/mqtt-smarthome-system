import natUpnp from 'nat-upnp';
import { promisify } from 'util';
import randomId from './common/random-id';
import shutdown, { ignore } from './shutdown';
import { repo as descriptionPrefix } from './git/repository';
 
const portRange = ((start = 29170, end = 29998) =>
  Array.from({length: (end - start)}, (v, k) => k + start))();
const randomPort = () => portRange.splice(Math.floor(Math.random() * portRange.length), 1)[0];

export const client = natUpnp.createClient();
client.timeout = 10000;
client.ssdp.sockets.forEach(ignore);

const externalIp = promisify(client.externalIp.bind(client));
const getMappings = promisify(client.getMappings.bind(client, { local: true }));
const portMapping = promisify(client.portMapping.bind(client));
const portUnmapping = promisify(client.portUnmapping.bind(client));

const getPrefixedMappings = ({ port: searchPort, description: searchDescription } = {}) =>
  getMappings().then(mappings =>
    mappings.filter(({ description, public: { port } }) =>
      description.startsWith(descriptionPrefix) &&
      (searchPort ? port === searchPort : true) &&
      (searchDescription ? description === searchDescription : true)
    ));

const mapPort = (port = randomPort(), description = `${descriptionPrefix} ${randomId()}`) =>
  portMapping({
    public: port,
    private: port,
    description,
    ttl: 300,
  })
  .then(() => getPrefixedMappings({ port, description }))
  .then(([successfulMapping]) => successfulMapping || Promise.reject(`Did not map ${description} to ${port}`))
  .then(({ ttl, public: { port }, description }) => {
    let tidy;
    const relive = setTimeout(() => {
      shutdown.off('exit', tidy);
      mapPort(port, description);
    }, (ttl - 5) * 1000);
    tidy = async () => {
      clearTimeout(relive);
      await portUnmapping({ public: port });
      client.close();
    };
    shutdown.on('exit', tidy);
    return port;
  })

export default Promise.all([ externalIp(), mapPort() ]).then(([ip, port]) => ({ ip, port }))
// What about when port changes or IP changes? Has to trigger a re-bind somehow
