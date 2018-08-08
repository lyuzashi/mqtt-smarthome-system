import EventEmitter from './common/promise-events';
import asyncHooks from 'async_hooks';

import fs from 'fs';
import util from 'util';

function debug(...args) {
  fs.writeSync(1, `${util.format(...args)}\n`);
}

const emitter = new EventEmitter();

const hooks = new Map();
const ignoredHandles = new Set();

export const exitHandler = ((error, exit = true) => {
  let handled = false;
  return () => {
    if (handled) return;
    handled = true;
    asyncHook.disable();
    const cleanup = emitter.emit('exit') || Promise.resolve();
    debug('🏃 cleaning up', cleanup)
    if (error) console.log(error.stack);
    if (exit) cleanup.then(process.exit);
  }
})();

const ignore = resource => {
  const asyncIdSymbol = Object.getOwnPropertySymbols(resource)
    .find(symbol => symbol.toString() === 'Symbol(asyncId)');
  const asyncId = resource[asyncIdSymbol];
  ignoredHandles.add(asyncId);
  debug('ignoring', asyncId);
}

const asyncHook = asyncHooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) { 
    if (!['SIGNALWRAP', 'TIMERWRAP'].includes(type)) {
      hooks.set(asyncId, resource);
    }
    debug('adding hook', asyncId, type);
    checkDone();
  },
  destroy(asyncId) {
    hooks.delete(asyncId);
    checkDone();
  }
});

const checkDone = () => {
  const actionHooks = [...hooks.keys()].filter(id => !ignoredHandles.has(id));
  debug(actionHooks);
  if(actionHooks.length === 0) {
    debug('Queue empty');
    exitHandler(null, true);
  }
};

asyncHook.enable();
ignore(setImmediate(checkDone));



//do something when app is closing
// process.on('beforeExit', exitHandler.bind(null, null, false));

// //catches ctrl+c event
process.on('SIGINT', exitHandler);

// // catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

// //catches uncaught exceptions
process.on('uncaughtException', exitHandler);

// emitter.on('exit', () => { console.log('🏍 exiting'); setTimeout(() => console.log('done'), 2000)});

ignore(setTimeout(() => console.log('first work done'), 10000));


setTimeout(() => console.log('last work done'), 2000);

export default emitter;
