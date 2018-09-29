import EventEmitter from './common/promise-events';

const emitter = new EventEmitter();

const exitHandler = (() => {
  let handled = false;
  return (error, exit = true) => {
    if (handled) return;
    handled = true;
    const cleanup = emitter.emit('exit') || Promise.resolve();
    if (error) console.log(error.stack);
    if (exit) {
      cleanup.then(process.exit)
      .catch(errors => {
        console.log(errors);
        process.exit();
      })
    }
  }
})();

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
export { exitHandler as now };
