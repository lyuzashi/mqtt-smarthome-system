import repl from 'repl';
// import hue from './interfaces/hue/client';
// import discover from './system/discover';
// import Readable from './system/readable';
// import Deferred from './system/common/deferred';
import './interfaces/gpio/pigpio';
import devices from './system/devices';



const { context } = repl.start();

// context.hue = hue;
// context.discover = discover;
// context.Readable = Readable;
// context.Deferred = Deferred;
context.devices = devices;

// (async () => { 
//   for await (const x of discover('opc')) { 
//     console.log(x) 
//   } 
// })()
