const asyncHooks = require('async_hooks');
const fs = require('fs');
const util = require('util');
const http = require('http');

function debug(...args) {
  console.log(...args);
}
const hooks = new Map();
const ignoredHandles = new Set();
const checkDone = () => {
  const actionHooks = [...hooks.keys()].filter(id => !ignoredHandles.has(id));
  if(actionHooks.length === 0) {
    shutdown();
  }
}

const asyncHook = asyncHooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) { 
    if (type !== 'TIMERWRAP') {
      hooks.set(asyncId, resource);
    }
    checkDone();
  },
  destroy(asyncId) {
    hooks.delete(asyncId);
    checkDone();
  }
});

let shuttingDown = false;
const shutdown = () => {
  if (shuttingDown) return;
  shuttingDown = true;
  asyncHook.disable();
  setTimeout(() => {
    debug('👋 shutting down');
    process.exit();
  }, 0);
}

asyncHook.enable();


const ignore = resource => {
  const asyncIdSymbol = Object.getOwnPropertySymbols(resource)
    .find(symbol => symbol.toString() === 'Symbol(asyncId)');
  const asyncId = resource[asyncIdSymbol];
  ignoredHandles.add(asyncId);
}

ignore(setImmediate(checkDone));



setTimeout(() => {
  debug('done');
  ignore(setTimeout(() => console.log('really done'), 1000));
}, 5000);

ignore(http.createServer().listen(3000));

setTimeout(() => { debug('ok') } , 10000);