import EventEmitter from './common/promise-events';
import asyncHooks from 'async_hooks';

const emitter = new EventEmitter();

const hooks = new Map();
const ignoredHandles = new Set();

const exitHandler = ((error, exit = true) => {
  let handled = false;
  return () => {
    if (handled) return;
    handled = true;
    asyncHook.disable();
    const cleanup = emitter.emit('exit') || Promise.resolve();
    if (error) console.log(error.stack);
    if (exit) cleanup.then(process.exit);
  }
})();

export const ignore = resource => {
  const asyncIdSymbol = Object.getOwnPropertySymbols(resource)
    .find(symbol => symbol.toString() === 'Symbol(asyncId)');
  const asyncId = resource[asyncIdSymbol];
  ignoredHandles.add(asyncId);
}

const asyncHook = asyncHooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) { 
    if (!['SIGNALWRAP', 'TIMERWRAP'].includes(type)) {
      hooks.set(asyncId, resource);
    }
  },
  destroy(asyncId) {
    hooks.delete(asyncId);
    checkDone();
  }
});

const checkDone = () => {
  const actionHooks = [...hooks.keys()].filter(id => !ignoredHandles.has(id));
  if(actionHooks.length === 0) {
    exitHandler(null, true);
  }
};

asyncHook.enable();
ignore(setImmediate(checkDone));

//do something when app is closing
process.on('beforeExit', exitHandler.bind(null, null, false));

// //catches ctrl+c event
process.on('SIGINT', exitHandler);

// // catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

// //catches uncaught exceptions
process.on('uncaughtException', exitHandler);

export default emitter;
