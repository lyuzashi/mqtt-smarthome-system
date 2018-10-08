import { promisify } from 'util';
import fs from '../system/common/webdav-fs';

const filename = 'mqtt-smarthome-system.json';

const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);

export const get = (key) => read(filename)
  .then(JSON.parse)
  .then(keys => key ? keys[key] : keys);

export const set = (key, value) => get()
  .then(document => Object.assign(document || {},
    'object' === typeof key ? key : { [key]: value }))
  .then(JSON.stringify)
  .then(document => write(filename, document));

export default get();
