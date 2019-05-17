import hap from './hap-nodejs-webfs';
import YAML from 'yamljs';
import path from 'path';
import os from 'os';
import EventedMap from '../../system/common/evented-map';
import mapper from '../../system/common/mapper';
import root from '../../root';
import mqtt from '../../system/mqtt';
import shutdown from '../../system/shutdown';

(async () => {

  const config = YAML.load(path.resolve(root, 'config/hap.yml'));
  const subscriptions = new EventedMap();

  const { uuid, Bridge, Accessory, Service, Characteristic } = await hap;
  
  const bridge = new Bridge(os.hostname(), uuid.generate(os.hostname()));
  
  Object.keys(config).forEach(namespace => {
    const device = config[namespace];
    const accessory = new Accessory(device.name, uuid.generate(namespace));
    accessory
      .getService(Service.AccessoryInformation)
      .setCharacteristic(Characteristic.Manufacturer, device.manufacturer)
      .setCharacteristic(Characteristic.Model, device.model)
      .setCharacteristic(Characteristic.SerialNumber, device.serial);
    if(device.identify) {
      accessory.on('identify', (paired, callback) => {
        mqtt.publish({
          topic: device.identify,
        }, callback);
      });
    }
  
    device.services.forEach(({ service: serviceName, characteristics }) => {
      // Only one of each service can be added unless subtypes are created.
      // How to create subtypes?
      const service = accessory.addService(Service[serviceName], device.name);
      Object.keys(characteristics).forEach(characteristicName => {
        const characteristicDefinition = characteristics[characteristicName]
        Object.keys(characteristicDefinition).forEach(eventName => {
          const event = characteristicDefinition[eventName];
          // Might need to create a characteristic if it's not part of the service defaults
          service.addOptionalCharacteristic(Characteristic.StatusFault);
          const characteristic = service.getCharacteristic(Characteristic[characteristicName]);
          const active = service.getCharacteristic(Characteristic.StatusFault);
          const map = event.map || {};
          switch(eventName) {
            case 'set':
              characteristic.on(eventName, (value, callback) => {
                // TODO perform mapping in reverse
                // Can call subscriptions.map(event.topic, event.map) to save
                // set mappings, since the topics will be different
                mqtt.publish({ topic: event.topic, payload: String(mapper(map,value)) }, callback);
              });
            break;
            case 'get':
              /* TODO
              It appears Apple HAP does not support setting characteristics with an error state 
              at the protocol level. This means it is not possible to switch unavailable devices to
              "not responding" unless they time out during a "get" request. The response waits for
              all requested values; at which time those with an Error value are deemed "not responding".
              Waiting for a timeout while preventing other devices from being used makes for a bad
              experience.

              The concept now is to use the internal cache for all values returned by the get request.
              This will make it instantly responsive. At the same time, sending a get message to 
              each device will trigger a cache update when they respond with status.
              The last step would be to time the period between the last status response and a get 
              message, allowing the cache to update itself with an error value for non responsive
              devices.
              */
              // Use topic mapping in subscriptions EventedMap
              subscriptions.map(event.topic, event.map);
              // Listen to MQTT topic and update subscriptions EventedMap value
              mqtt.subscribe(event.topic, (topic, value) => subscriptions.set(event.topic, value));
              // Listen to changes in subscriptions EventedMap and send to HAP characteristic
              subscriptions.on(event.topic, value => characteristic.updateValue(value));
              // On startup, request current value
              mqtt.publish({ topic: event.request });

              characteristic.on(eventName, callback => {
                // Respond immediately with default value to keep HAP responsive while value is retrieved
                if (subscriptions.has(event.topic)) {
                  callback(null, subscriptions.get(event.topic));
                } else {
                  callback(null, characteristic.getDefaultValue());
                }
                // Send another get message and provide a timeout before setting to error state
                mqtt.publish({ topic: event.request });
                const timeout = setTimeout(() => {
                  console.warn(new Date().toLocaleTimeString(), `Timeout waiting for ${event.topic}`);
                  subscriptions.off(event.topic, getCallback);
                  subscriptions.set(event.topic, new Error('Not Responding'));
                }, 5000);
                const getCallback = () => clearTimeout(timeout);
                return subscriptions.once(event.topic, getCallback);
              })
            break;
          }
        });
      });
    });
  
  
    bridge.addBridgedAccessory(accessory);
  });
  
  bridge.publish({
    username: "CC:22:3D:E3:CE:F6",
    port: 51826,
    pincode: "111-11-111",
    category: Accessory.Categories.BRIDGE
  });
  
  shutdown.on('exit', () => bridge.unpublish());
  

})();
