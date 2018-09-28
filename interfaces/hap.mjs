import storage from 'node-persist';
import hap from 'hap-nodejs';
import YAML from 'yamljs';
import path from 'path';
import EventedMap from '../system/common/evented-map';
import mapper from '../system/common/mapper';
import root from '../root';
import mqtt from '../system/mqtt';
import shutdown from '../system/shutdown';

const config = YAML.load(path.resolve(root, 'config/hap.yml'));
const { uuid, Bridge, Accessory, Service, Characteristic } = hap;
const subscriptions = new EventedMap();

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
            subscriptions.map(event.topic, event.map);
            mqtt.subscribe(event.topic, (topic, value) => {
              subscriptions.set(event.topic, value);
              console.log('Updating HAP value', event.topic, subscriptions.get(event.topic));
              characteristic.updateValue(subscriptions.get(event.topic));
            });
            characteristic.on(eventName, callback => {
              if (subscriptions.has(event.topic)) {
                return callback(null, subscriptions.get(event.topic));
              }
              mqtt.publish({ topic: event.request });
              return subscriptions.once(event.topic, value => callback(null, value));
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
  pincode: "031-45-154",
  category: Accessory.Categories.BRIDGE
});

shutdown.on('exit', () => bridge.unpublish());
