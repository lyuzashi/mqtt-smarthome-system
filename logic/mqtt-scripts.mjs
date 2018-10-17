import vm from 'vm';
import { readFileSync } from 'fs';
import { dirname } from 'path';
import mqtt from '../system/mqtt';
import fs from '../system/common/webdav-fs';
import require from '../system/common/require';

  // Run only once
function start() {
  firstConnect = false;
  sandboxModules.push(sandboxStdlib);
  loadDir(config.dir);
}

const main = require.resolve('mqtt-scripts');
const sandboxStdlib = require('mqtt-scripts/sandbox/stdlib.js');
const __dirname = dirname(main);
const mqttScriptsSrc = readFileSync(main).toString().replace(/^#.*/, '');
const script = new vm.Script(mqttScriptsSrc);
const overrideStart = new vm.Script(start.toString());

const context = vm.createContext({
  require: require({
    fs,
    mqtt,
    './config.js': {
      dir: 'logic',
      disableWatch: true,
      name: 'logic',
      verbosity: 'error',
    },
    './package.json': {}
    // log: {
      // handle errors etc
      // for script errors:
      // scrape stack from error with [] around it. 
      // log.error([name + ' ' + stack.join('\n')]);
    // }
  }),
  process: { on() {} },
  setTimeout,
  setInterval,
  clearTimeout,
  clearInterval,
  Buffer,
  sandboxStdlib,
});

script.runInContext(context);
overrideStart.runInContext(context);
