import repl from 'repl';
// import hue from './interfaces/hue/client';
// import discover from './system/discover';
import Readable from './system/readable';
import Deferred from './system/common/deferred';


const { context } = repl.start();

// context.hue = hue;
// context.discover = discover;
context.Readable = Readable;
context.Deferred = Deferred;


// (async () => { 
//   for await (const x of discover('opc')) { 
//     console.log(x) 
//   } 
// })()
