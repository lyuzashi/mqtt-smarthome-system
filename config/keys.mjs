import { promisify } from 'util';
import bug from 'debug';
import fs from '../system/common/webdav-fs';

const debug = bug('smarthome:config:keys');
const filename = 'mqtt-smarthome-system.json';

const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);

// If these cannot be accessed (network down), then it needs to throw
export const get = (key) => read(filename)
  .then(JSON.parse)
  .then(keys => key ? keys[key] : keys)
  .catch(error => { debug('Failed to get key %s, %o', key, error.message); throw error });

export const set = (key, value) => get()
  .then(document => Object.assign(document || {},
    'object' === typeof key ? key : { [key]: value }))
  .then(document => JSON.stringify(document, null, 2))
  .then(document => write(filename, document));

export default get();
