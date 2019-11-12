import repl from 'repl';
// import hue from './interfaces/hue/client';
// import discover from './system/discover';
// import Readable from './system/readable';
// import Deferred from './system/common/deferred';
import HubLocation, { locations } from './interfaces/location/hub';
import ExpiringList from './system/common/expiring-list';


const { context } = repl.start();

// context.hue = hue;
// context.discover = discover;
// context.Readable = Readable;
// context.Deferred = Deferred;
context.ExpiringList = ExpiringList;
context.HubLocation = HubLocation;
context.locations = locations;


// (async () => { 
//   for await (const x of discover('opc')) { 
//     console.log(x) 
//   } 
// })()
