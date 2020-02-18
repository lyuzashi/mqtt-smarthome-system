import { resolve } from 'path';
import root from '../root';
import fork from '../system/fork';
// import attach from '../system/mqtt/attach';
import app from '../system/web';
import shutdown from '../system/shutdown';
import fs from '../system/common/webdav-fs';

let child;

const start = () => {
  // child = attach(fork(resolve(root, 'logic/mqtt-scripts.mjs')));
  child = fork(resolve(root, 'logic/mqtt-scripts.mjs'));
  child.on('exit', start);
}

const terminate = () => {
  if (!child) return;
  child.off('exit', start);
  child.kill();
}

shutdown.on('exit', terminate);

app.post('/restart-logic', (req, res) => {
  child.kill();
  res.end();
});

(async () => {
  try {
    await fs.statAwait('logic');
  } catch (error) {
    fs.mkdirAwait('logic');
  }
  start();
})();