import Pattern from 'mqtt-pattern';
import Deferred from '../common/deferred';

const smarthomeTopic = '+participant/+method/+item/#interfaces';
const registry = new Map;

const getRegistry = registry.get.bind(registry);

export { getRegistry as registry };

// TODO allow overrides at every level e.g. device with characteristic properties
export default ({ devices, types, characteristics }) => devices.map(device => {
  device.fullName = device.room && device.name ? `${device.room} ${device.name}` : device.name || device.id;
  const driver = new Deferred;
  registry.set(device.fullName, driver.promise);
  device.register = driver.resolve;
  device.driver = driver.promise;
  const type = types[device.type];
  if (type) {
    Object.assign(device, type);
  }
  if (device.characteristics) {
    device.characteristics.forEach(characteristic => {
      const definition = characteristics[characteristic.name];
      if (definition) {
        if (definition.methods) {
          definition.methods.forEach((method, index) => {
            definition.methods[index] = {
              method,
              topic: Pattern.fill(smarthomeTopic, {
                participant: device.participant,
                item: device.fullName, 
                method,
                interfaces: [characteristic.name]
              })
            }
          })
        }
        Object.assign(characteristic, definition);
      }
    })
  }
  return device;
});
