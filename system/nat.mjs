import natUpnp from 'nat-upnp';
import { promisify } from 'util';
import EventEmitter from 'events';
import randomId from './common/random-id';
import shutdown from './shutdown';
import { repo as descriptionPrefix } from './git/repository';

const current = { ip: undefined, port: undefined };
const getCustomPort = new Array();
const reconfigure = new EventEmitter();

const portRange = ((start = 29170, end = 29998) =>
  Array.from({length: (end - start)}, (v, k) => k + start))();
const randomPort = () => portRange.splice(Math.floor(Math.random() * portRange.length), 1)[0];

export const client = natUpnp.createClient();
client.timeout = 3000;

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
  new Promise(resolve => process.nextTick(resolve))
  .then(() => Promise.all(getCustomPort))
  .then(ports => ports.find(p => p))
  .then(customPort => (portMapping({
    public: customPort || port,
    private: customPort || port,
    description,
    ttl: 300,
  }), customPort))
  .then(customPort => getPrefixedMappings({ port: customPort || port }))
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
    if (current.port && current.port !== port) reconfigure.emit('port', port);
    current.port = port;
    return port;
  })
  .catch(error =>{
    console.warn(error);
    return mapPort(randomPort(), description);
  })

const getExternalIp = () =>
  externalIp()
  .then(ip => {
    if (current.ip && current.ip !== ip) reconfigure.emit('ip', ip);
    current.ip = ip;
    return ip;
  })
  .catch(error => {
    console.warn(error);
    return getExternalIp();
  });

const refreshIp = setInterval(getExternalIp, 300000);

shutdown.on('exit', () => clearInterval(refreshIp));

// export default Promise.all([ getExternalIp(), mapPort() ]).then(([ip, port]) => ({ ip, port }))

export const getPort = mapPort();
export const getIp = getExternalIp();

export const portChange = (...args) => reconfigure.on('port', ...args);
export const ipChange = (...args) => reconfigure.on('port', ...args);
export const customPort = (getPort) => getCustomPort.push(getPort);
// What about when port changes or IP changes? Has to trigger a re-bind somehow
