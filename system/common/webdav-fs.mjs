import WebDavFS from 'webdav-fs';
import { context } from '../shell';

const url = 'https://kryten.grid.robotjamie.com/config/';

const fs = WebDavFS(url);

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

context.fs = fs;

export default fs;
