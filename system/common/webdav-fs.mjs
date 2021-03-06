import WebDavFS from 'webdav-fs';
import promisify from 'util.promisify';
import { context } from '../shell';

const url = process.env.NODE_ENV === 'production' ? '/data/' : 'https://memory.grid.robotjamie.com/';

const fs = WebDavFS(url);

const asyncMethods = ['mkdir', 'readdir', 'readFile', 'rename', 'rmdir', 'stat', 'unlink', 'writeFile', 'exists' ];

Object.assign(fs, {
  exists(path, callback) {
    fs.stat(path, (error) => {
      if (error !== null) {
        if (error.status === 404) return callback(false);
        return callback(error);
      }
      callback(true);
    })
  }
});

asyncMethods.forEach(method => Object.assign(fs, { [`${method}Await`]: promisify(fs[method])}));

context.fs = fs;

export default fs;
