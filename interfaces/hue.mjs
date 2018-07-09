import Hue from 'homebridge-hue';
import { HueBridge } from 'homebridge-hue/lib/HueBridge';
import hap from 'hap-nodejs';

/*
var Hue = require('homebridge-hue');
var { HueBridge } = require ('homebridge-hue/lib/HueBridge');
var hap = require('hap-nodejs');
*/

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

const logger = {
  debug() {},
  info() {},
  warn() {},
  error() {},
  log() {},
}

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
}).then((platform) => {
  return platform.findBridges().map((host) => {
    const bridge = new HueBridge(platform, host)
    platform.bridges.push(bridge);
    let beat = -1
    setInterval(() => {
      beat += 1
      beat %= 7 * 24 * 3600
      bridge.heartbeat(beat)
    }, 1000);
    return bridge.accessories();
  });
});

// Returns an array-wrapped array of accessories
// Each has a lights or sensors class on resource
// Hue Tap events can be listened to on [HueAccessory{sensors}].resource.buttonMap['1'].characteristics[{displayName: 'Programmable Switch Event'}].on('change')
// '1' should be the button number
// For a light – [HueAccessory{lights}].resource, the resource is a HueLight 
// .setSat, .setCT, setOn etc all work

// Osram lights work with included fix to disable transition, otherwise they get stuck at 1% when turning off