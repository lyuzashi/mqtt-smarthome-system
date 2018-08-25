import storage from 'node-persist';
import hap from 'hap-nodejs';
import YAML from 'yamljs';
import path from 'path';
import Mapper from '../system/common/mapper';
import root from '../root';
import mqtt from '../system/mqtt';
import shutdown from '../system/shutdown';

const config = YAML.load(path.resolve(root, 'config/hap.yml'));
const { uuid, Bridge, Accessory, Service, Characteristic } = hap;
const subscriptions = new Mapper();

storage.initSync(); // forced to use this by node-hap... how can it be hacked
// to use web dav fs or similar?

const bridge = new Bridge('HAL9000', uuid.generate('HAL9000'));

Object.keys(config).forEach(namespace => {
  const device = config[namespace];
  const accessory = new Accessory(device.name, uuid.generate(namespace));
  accessory
    .getService(Service.AccessoryInformation)
    .setCharacteristic(Characteristic.Manufacturer, device.manufacturer)
    .setCharacteristic(Characteristic.Model, device.model)
    .setCharacteristic(Characteristic.SerialNumber, device.serial);
  accessory.on('identify', (paired, callback) => {
    console.log('idenifying', device.name);
    mqtt.publish({
      topic: device.identify,
    }, callback);
  });

  device.services.forEach(({ service: serviceName, characteristics }) => {
    // Only one of each service can be added unless subtypes are created.
    // How to create subtypes?
    const service = accessory.addService(Service[serviceName], device.name);
    Object.keys(characteristics).forEach(characteristicName => {
      const characteristicDefinition = characteristics[characteristicName]
      Object.keys(characteristicDefinition).forEach(eventName => {
        const event = characteristicDefinition[eventName];
        // Might need to create a characteristic if it's not part of the service defaults
        const characteristic = service.getCharacteristic(Characteristic[characteristicName]);
        switch(eventName) {
          case 'set':
            characteristic.on(eventName, (value, callback) => {
              console.log('setting', device.name, value, event.map[value]);
              mqtt.publish({ topic: event.topic, payload: event.map[value] }, callback);
            });
          break;
          case 'get':
            // Requires mapping
            subscriptions.map(event.topic, event.map);
            mqtt.subscribe(event.topic, (topic, value) => subscriptions.set(event.topic, value));
            characteristic.on(eventName, callback => {
              if (subscriptions.has(event.topic)) {
                return callback(null, subscriptions.get(event.topic));
              }
              mqtt.publish({ topic: event.request });
              return subscriptions.once(event.topic, value => callback(null, value));
              // Publish request then wait for an evented response.
              // Can the subscriptions map send "once" event for the required topic?
            })
          break;
        }
      });
    });
  });


  bridge.addBridgedAccessory(accessory);

  // outlet
  // .addService(Service.Lightbulb, "Fake Outlet") // services exposed to the user should have "names" like "Fake Light" for us
  // .getCharacteristic(Characteristic.On)
  // .on('set', function(value, callback) {
  //   FAKE_OUTLET.setPowerOn(value);
  //   callback(); // Our fake Outlet is synchronous - this value has been successfully set
  // });
  /*
  outlet
  .getService(Service.Lightbulb)
  .getCharacteristic(Characteristic.On)
  .on('get', function(callback) {

    // this event is emitted when you ask Siri directly whether your light is on or not. you might query
    // the light hardware itself to find this out, then call the callback. But if you take longer than a
    // few seconds to respond, Siri will give up.

    var err = null; // in case there were any problems

    if (FAKE_OUTLET.powerOn) {
      console.log("Are we on? Yes.");
      callback(err, true);
    }
    else {
      console.log("Are we on? No.");
      callback(err, false);
    }
  }); 

  */

});



bridge.publish({
  username: "CC:22:3D:E3:CE:F6",
  port: 51826,
  pincode: "031-45-154",
  category: Accessory.Categories.BRIDGE
});

shutdown.on('exit', () => bridge.unpublish());


/*
var err = null; // in case there were any problems

// here's a fake hardware device that we'll expose to HomeKit
var FAKE_OUTLET = {
    setPowerOn: function(on) {
    console.log("Turning the outlet %s!...", on ? "on" : "off");
    if (on) {
          FAKE_OUTLET.powerOn = true;
          mqtt.publish({
            topic: 'kitchen-lights/set/power1',
            payload: 'ON',
            qos: 0, // 0, 1, or 2
            retain: false // or true
          });
          if(err) { return console.log(err); }
          console.log("...outlet is now on.");
    } else {
          FAKE_OUTLET.powerOn = false;
          mqtt.publish({
            topic: 'kitchen-lights/set/power1',
            payload: 'OFF',
            qos: 0, // 0, 1, or 2
            retain: false // or true
          });
          if(err) { return console.log(err); }
          console.log("...outlet is now off.");
    }
  },
    identify: function() {
    console.log("Identify the outlet.");
    }
}

// Generate a consistent UUID for our outlet Accessory that will remain the same even when
// restarting our server. We use the `uuid.generate` helper function to create a deterministic
// UUID based on an arbitrary "namespace" and the accessory name.
var outletUUID = uuid.generate('hap-nodejs:accessories:test');

// This is the Accessory that we'll return to HAP-NodeJS that represents our fake light.
var outlet = new Accessory('Outlet', outletUUID);


// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
outlet.username = "1A:2B:3C:4D:5D:FF";
outlet.pincode = "031-45-154";

// set some basic properties (these values are arbitrary and setting them is optional)
outlet
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "Oltica")
  .setCharacteristic(Characteristic.Model, "Rev-1")
  .setCharacteristic(Characteristic.SerialNumber, "A1S2NASF88EW");

// listen for the "identify" event for this Accessory
outlet.on('identify', function(paired, callback) {
  FAKE_OUTLET.identify();
  callback(); // success
});

// Add the actual outlet Service and listen for change events from iOS.
// We can see the complete list of Services and Characteristics in `lib/gen/HomeKitTypes.js`
outlet
  .addService(Service.Lightbulb, "Fake Outlet") // services exposed to the user should have "names" like "Fake Light" for us
  .getCharacteristic(Characteristic.On)
  .on('set', function(value, callback) {
    FAKE_OUTLET.setPowerOn(value);
    callback(); // Our fake Outlet is synchronous - this value has been successfully set
  });

// We want to intercept requests for our current power state so we can query the hardware itself instead of
// allowing HAP-NodeJS to return the cached Characteristic.value.
outlet
  .getService(Service.Lightbulb)
  .getCharacteristic(Characteristic.On)
  .on('get', function(callback) {

    // this event is emitted when you ask Siri directly whether your light is on or not. you might query
    // the light hardware itself to find this out, then call the callback. But if you take longer than a
    // few seconds to respond, Siri will give up.

    var err = null; // in case there were any problems

    if (FAKE_OUTLET.powerOn) {
      console.log("Are we on? Yes.");
      callback(err, true);
    }
    else {
      console.log("Are we on? No.");
      callback(err, false);
    }
  }); 

console.log(outlet)

bridge.addBridgedAccessory(outlet);

*/


