import EventEmitter from './common/promise-events';
import asyncHooks from 'async_hooks';

const emitter = new EventEmitter();

export const ignoredHandles = new Set([
  process.stdin,
  process.stdout,
  process.stderr
])

const removeHook = () => {
  if (!process._getActiveHandles().filter(handle => !ignoredHandles.has(handle)).length) {
    asyncHook.disable();
    exitHandler();
  }
};

const asyncHook = asyncHooks.createHook({
  after: removeHook,
  destroy: removeHook,
  promiseResolve: removeHook,
}).enable();

export const exitHandler = (error, exit = true) => {
  // Is there a way to get functions called on emit and wait for promises before exiting?
  console.log('exit?')
  const cleanup = emitter.emit('exit');
  console.log(cleanup)
  if (error) console.log(error.stack);
  if (exit) cleanup.then(process.exit);
}

//do something when app is closing
process.on('beforeExit', exitHandle.bind(null, null, false));

//catches ctrl+c event
process.on('SIGINT', exitHandler);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

//catches uncaught exceptions
process.on('uncaughtException', exitHandler);


emitter.on('exit', () => { console.log('exiting'); setTimeout(() => console.log('done'), 2000)});

export default emitter;
