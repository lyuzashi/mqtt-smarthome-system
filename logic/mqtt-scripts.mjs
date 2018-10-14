import vm from 'vm';
import { readFileSync } from 'fs';
import { dirname } from 'path';
import mqtt from '../system/mqtt';
import fs from '../system/common/webdav-fs';
import require from '../system/common/require';

const main = require.resolve('mqtt-scripts');
const __dirname = dirname(main);
const mqttScriptsSrc = readFileSync(main).toString().replace(/^#.*/, '');
const script = new vm.Script(mqttScriptsSrc);

const context = vm.createContext({
  require: require({
    fs,
    mqtt,
    './config.js': {
      dir: 'logic',
      disableWatch: true,
      name: 'logic',
    },
    './package.json': {}
  }),
  process: {
    on() {}
  },
  setTimeout,
  setInterval,
  clearTimeout,
  clearInterval,
  Buffer,
  sandboxStdlib: require('mqtt-scripts/sandbox/stdlib.js'),
});

script.runInContext(context);

(new vm.Script('sandboxModules.push(sandboxStdlib); loadDir("logic")')).runInContext(context);


// const proxyquire = require('proxyquire');

// module.exports = ({ fs, mqtt, config }) => proxyquire('mqtt-scripts', {
//   fs, mqtt, './config.js': config
// })

// proxquire 'mqtt-scripts' with custom 
// config.js
/*
        c: 'config',
        d: 'dir',
        h: 'help',
        s: 'variable-prefix',
        t: 'disable-variables',
        l: 'latitude',
        m: 'longitude',
        n: 'name',
        u: 'url',
        v: 'verbosity',
        w: 'disable-watch'
*/
// mqtt
/*
  .connect returns the local server
  .on('connect') needs to be fired
*/
// fs
/*
  must support 
  - existsSync (only for sandboxed require - could override/disable?)
  - readFile
  - readdir
*/

