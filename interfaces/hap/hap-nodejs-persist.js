const os = require('os');
const proxyquire = require('proxyquire');
const { fs: memfs, vol } = require('memfs');

module.exports = (fs) => new Promise((resolve, reject) => {

  const filename = `${os.hostname()}-hap.json`;
  const storage = proxyquire('node-persist', { fs: Object.assign(memfs, { '@global': true }) });
  const persistSync = storage.persistSync;
  
  storage['@global'] = true;
  storage.persistSync = function() {
    persistSync();
    fs.writeFile(filename, JSON.stringify(vol.toJSON()), () => {});
  };
  
  const { init, ...hap } = proxyquire('hap-nodejs', { 'node-persist': storage });

  fs.readFile(filename, (error, data) => {
    if (!error) vol.fromJSON(JSON.parse(data));
    if (error && error.status !== 404) return reject(error);
    init('/');
    resolve(hap);
  });
});
