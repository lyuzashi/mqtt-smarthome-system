import YAML from 'yamljs';
import path from 'path';
import Pattern from 'mqtt-pattern';
import root from '../root';

const devices = YAML.load(path.resolve(root, 'config/devices.yml'));
const types = YAML.load(path.resolve(root, 'config/types.yml'));
const characteristics = YAML.load(path.resolve(root, 'config/characteristics.yml'));

const smarthomeTopic = '+participant/+method/+item/#interfaces';

// TODO allow overrides at every level e.g. device with characteristic properties
devices.forEach(device => {
  device.fullName = device.room && device.name ? `${device.room} ${device.name}` : device.name;
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

});

export default devices;

// console.dir(devices, { depth: null });