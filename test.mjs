import repl from 'repl';
// import hue from './interfaces/hue/client';
// import discover from './system/discover';
// import Readable from './system/readable';
// import Deferred from './system/common/deferred';
import HubLocation from './interfaces/location/hub';
import ExpiringList from './system/common/expiring-list';
import getKey from './config/keys'
// import './visualizations/web';
// import RED from './system/red';


const { context } = repl.start();

// context.hue = hue;
// context.discover = discover;
// context.Readable = Readable;
// context.Deferred = Deferred;
context.ExpiringList = ExpiringList;
context.HubLocation = HubLocation;
context.getKey = getKey;
// context.RED = RED;


// (async () => { 
//   for await (const x of discover('opc')) { 
//     console.log(x) 
//   } 
// })()