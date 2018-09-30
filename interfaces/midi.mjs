import midi from 'midi';
import path from 'path';
import YAML from 'yamljs';
import root from '../root';
import mqtt from '../system/mqtt';
import shutdown from '../system/shutdown';

const config = YAML.load(path.resolve(root, 'config/midi.yml'));

export const input = new midi.input();

input.ignoreTypes(false, false, false); 

const port = [...Array(input.getPortCount()).keys()].map(port =>input.getPortName(port))
  .findIndex(name => name.includes(config.controller));

if(port >= 0) {
  input.openPort(port);
  shutdown.on('exit', input.closePort.bind(input));
}

let bank = undefined;

const status = Object.keys(config.status).reduce((status, type) =>
  Object.assign(status, { [config.status[type].status]: { ...config.status[type], type } }), {});

const banks = Object.keys(config.banks).reduce((banks, index) =>
  Object.assign(banks, {
    [config.banks[index].value]: {
      ...config.banks[index],
      notes: Object.keys(config.banks[index].notes).reduce((notes, indexN) => 
        Object.assign(notes, {
          [config.keys.find(key => key.name === config.banks[index].notes[indexN].key).value]: {
            ...config.keys.find(key => key.name === config.banks[index].notes[indexN].key),
            ...config.banks[index].notes[indexN],
          }
        }), {}),
    }
  }), {});

const keys = Object.keys(config.keys).reduce((keys, index) =>
  Object.assign(keys, { [config.keys[index].value]: config.keys[index] }), {});

input.on('message', (deltaTime, [statusNumber, ...data]) => {
  const { dataValue, id, type } = status[statusNumber];
  const value = data[dataValue];
  const key = data[id];
  switch(type) {
    case 'bank':
      bank = banks[value];
    break;
    case 'note':
      if (!bank) return;
      const note = bank.notes[key];
      if (!note) return console.log('hit undefined note', key, value, data);
      if(note.topic) {
        mqtt.publish({
          topic: note.topic,
          payload: String(value),
          qos: 0, // 0, 1, or 2
          retain: false // or true
        });
      }
    break;
  }
});
