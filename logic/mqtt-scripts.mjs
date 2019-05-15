import vm from 'vm';
import { readFileSync } from 'fs';
import { dirname } from 'path';
import bug from 'debug';
import mqtt from '../system/mqtt';
import fs from '../system/common/webdav-fs';
import require from '../system/common/require';

const debug = bug('smarthome:logic:scripts');

  // Run only once
function start() {
  log.stdout = (file, message) => debug(message);
  log.setLevel('info');
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
      latitude: -33.831680,
      longitude: 151.222360,
    },
    './package.json': {},
  }),
  console,
  Date,
  process: { on() {} },
  setTimeout,
  setInterval,
  clearTimeout,
  clearInterval,
  Buffer,
  sandboxStdlib,
  debug,
});

script.runInContext(context);
overrideStart.runInContext(context);
