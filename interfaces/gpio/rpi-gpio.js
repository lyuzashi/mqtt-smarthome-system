const debug = require('debug')('smarthome:interfaces:gpio');

const mock = {
  setup(channel, direction, edge, callback) {
    if (typeof direction === 'function') callback = direction;
    if (typeof edge === 'function') callback = edge;
    debug('Mock GPIO setup %d %s %s', channel, direction, edge);
    if (typeof callback === 'function') callback(null);
  },
  read(channel, callback) {
    debug('Mock GPIO read %d', channel);
    callback(false);
  },
  write(channel, value, callback) {
    debug('Mock GPIO write %d %o', channel, value);
    if (typeof callback === 'function') callback(null);
  },
  setMode(mode) {
    debug('Mock GPIO set mode %o', mode);
  },
  destroy() {} ,
  input(...args) { return mock.read(...args); },
  output(...args) { return mock.write(...args); },
  on(event, callback) {
    debug('Mock GPIO listening %s', event);
  },
  promise: {
    setup(channel, direction, edge) {
      debug('Mock GPIO setup %d %s %s', channel, direction, edge);
      return Promise.resolve();
    },
    read(channel) {
      debug('Mock GPIO read %d', channel);
      return Promise.resolve(false);
    },
    write(channel, value) {
      debug('Mock GPIO write %d %o', channel, value);
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