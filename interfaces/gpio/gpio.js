const mock = {
  setup(channel, direction, edge, callback) {
    if (typeof direction === 'function') callback = direction;
    if (typeof edge === 'function') callback = edge;
    console.log('GPIO setup', channel, direction, edge);
    if (typeof callback === 'function') callback(null);
  },
  read(channel, callback) {
    console.log('GPIO read', channel);
    callback(false);
  },
  write(channel, value, callback) {
    console.log('GPIO write', channel, value);
    if (typeof callback === 'function') callback(null);
  },
  setMode(mode) {
    console.log('GPIO set mode', mode);
  },
  destroy() {} ,
  input(...args) { return mock.read(...args); },
  output(...args) { return mock.write(...args); },
  on(event, callback) {
    console.log('GPIO listening', event);
  },
  promise: {
    setup(channel, direction, edge) {
      console.log('GPIO setup', channel, direction, edge);
      return Promise.resolve();
    },
    read(channel) {
      console.log('GPIO read', channel);
      return Promise.resolve(false);
    },
    write(channel, value) {
      console.log('GPIO write', channel, value);
      return Promise.resolve();
    },
    input(...args) { return mock.promise.read(...args); },
    output(...args) { return mock.promise.write(...args); },
    destroy() { return Promise.resolve() } ,
  },
  DIR_IN: 'in',
  DIR_OUT: 'out',
  DIR_LOW: 'low',
  DIR_HIGH: 'high',
  MODE_RPI: 'mode_rpi',
  MODE_BCM: 'mode_bcm',
  EDGE_NONE: 'none',
  EDGE_RISING: 'rising',
  EDGE_FALLING: 'falling',
  EDGE_BOTH: 'both',
}

module.exports = process.env.NODE_ENV === 'production' ?
  require('rpi-gpio') : mock;