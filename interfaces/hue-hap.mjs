import Hue from 'homebridge-hue';
import HuePlatformLib from 'homebridge-hue/lib/HuePlatform';
import HueBridgeLib from 'homebridge-hue/lib/HueBridge';
import hap from 'hap-nodejs';
import keys from '../config/keys';

const { HuePlatform, setHomebridge } = HuePlatformLib;
const { HueBridge } = HueBridgeLib;

// const {  } = await keys;

const options = {
  "platform": "Hue",
  "name": "Hue",
  "sensors": true,
  "philipsLights": true,
  "lights": true,
  "ct": true,
  "rooms": false,
  "groups": false,
  "schedules": false,
  "rules": false,
  "heartrate": 2,
  "nativeHomeKit": false,
  "users": {

  }
};

const logger = Object.assign(out => console.log(out), {
  debug() {},
  info() {},
  warn() {},
  error() {},
  log() {},
}, console);

// (async () => {
  
//   const homebridge = {
//     hap,
//     // user: {
//     //   storagePath() { return path.resolve('.') }
//     // },
//     // registerPlatform(id, name, Platform) {
//     //   platform = new Platform(logger, options, homebridge));
//     // }
//   }
//   setHomebridge(homebridge);
//   const platform = new HuePlatform(logger, options, homebridge);
//   // Hue(homebridge);
//   const bridges = await platform.findBridges().map((host) => {
//     const bridge = new HueBridge(platform, host)
//     platform.bridges.push(bridge);
//     let beat = -1
//     setInterval(() => {
//       beat += 1
//       beat %= 7 * 24 * 3600
//       bridge.heartbeat(beat)
//     }, 1000);
//     return bridge;
//   });
//   const [bridge] = bridges;
//   const accessories = await bridge.accessories();
//   console.log('setup user', bridge.username);
// })();

export const platform = new Promise((resolve, reject) => {
  const homebridge = {
    hap,
    user: {
      storagePath() { return path.resolve('.') }
    },
    registerPlatform(id, name, platform) {
      resolve(new platform(logger, options, homebridge));
    }
  }
  Hue(homebridge);
}).then((platform) =>
  platform.findBridges().map((host) => {
    const bridge = new HueBridge(platform, host)
    platform.bridges.push(bridge);
    let beat = -1
    setInterval(() => {
      beat += 1
      beat %= 7 * 24 * 3600
      bridge.heartbeat(beat)
    }, 1000);
    return bridge;
    // return bridge.accessories();
  })
)
// .then(([bridge]) =>
//   bridge.createUser().then(Promise.resolve(bridge))
//)
.then(([bridge]) => {
  console.log(bridge);
  console.log(bridge.username);
  return bridge.accessories()
}).then(console.log);


//console.log(bridge.createUser);

// Returns an array-wrapped array of accessories
// Each has a lights or sensors class on resource
// Hue Tap events can be listened to on [HueAccessory{sensors}].resource.buttonMap['1'].characteristics[{displayName: 'Programmable Switch Event'}].on('change')
// '1' should be the button number
// For a light – [HueAccessory{lights}].resource, the resource is a HueLight 
// .setSat, .setCT, setOn etc all work

// Osram lights work with included fix to disable transition, otherwise they get stuck at 1% when turning off