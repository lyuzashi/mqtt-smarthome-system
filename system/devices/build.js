const clone = require('clone');
const Pattern = require('mqtt-pattern');
const Deferred = require('../common/deferred');

const smarthomeTopic = '+participant/+method/+item/#interfaces';
const registry = new Map;

const topicCast = new Map;

const getRegistry = registry.get.bind(registry);

// TODO allow overrides at every level e.g. device with characteristic properties
const build = ({ devices, types, characteristics }) => devices.map(device => {
  device.fullName = device.room && device.name ? `${device.room} ${device.name}` : device.name || device.id;
  const driver = new Deferred;
  registry.set(device.fullName, driver.promise);
  device.register = driver.resolve;
  device.driver = driver.promise;
  const type = types[device.type];
  if (type) {
    Object.assign(device, clone(type));
  }
  if (device.characteristics) {
    device.characteristics.forEach(characteristic => {
      const definition = clone(characteristics[characteristic.name]);
      if (definition) {
        if (definition.methods) {
          definition.methods.forEach((method, index) => {
            // TODO if method is status, register the characteristic type for mqtt casting
            const topic = Pattern.fill(smarthomeTopic, {
              participant: device.participant,
              item: device.fullName, 
              method,
              interfaces: [characteristic.name]
            });
            if (method == 'status') topicCast.set(topic, definition.type);
            definition.methods[index] = { method, topic };
          })
        }
        Object.assign(characteristic, definition);
      }
    })
  }
  return device;
});

module.exports = { build, registry: getRegistry, topicCast };
