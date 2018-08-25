import WebDavFS from 'webdav-fs';
import { promisify } from 'util';

const url = 'https://kryten.grid.robotjamie.com/config/';
const filename = 'mqtt-smarthome-system.json';

const fs = WebDavFS(url);

const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);

export const get = (key) => read(filename)
  .then(JSON.parse)
  .then(keys => key ? keys[key] : keys);

export const set = (key, value) => get()
  .then(document => Object.assign(document || {}, { [key]: value }))
  .then(JSON.stringify)
  .then(document => write(filename, document));

export default get();
