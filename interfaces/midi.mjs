import midi from 'midi';
import path from 'path';
import YAML from 'yamljs';
import root from '../root';
import shutdown from '../system/shutdown';

const config = YAML.load(path.resolve(root, 'config/midi.yml'));

export const input = new midi.input();

input.ignoreTypes(false, false, false); 

shutdown.on('exit', input.closePort.bind(input));

const port = [...Array(input.getPortCount()).keys()].map(port =>input.getPortName(port))
  .findIndex(name => name.includes(config.controller));

input.openPort(port);

let bank = undefined;

const status = Object.keys(config.status).reduce((status, type) =>
  Object.assign(status, { [config.status[type].status]: { ...config.status[type], type } }), {});

const banks = Object.keys(config.banks).reduce((banks, index) =>
  Object.assign(banks, { [config.banks[index].value]: config.banks[index] }), {});

input.on('message', (deltaTime, [statusNumber, ...data]) => {
  const { dataValue, id, type } = status[statusNumber];
  const value = data[dataValue];
  const key = data[id];
  switch(type) {
    case 'bank':
      bank = banks[value];
      console.log('Now on bank', bank);
    break;
    case 'note':
      
      console.log('hit note', key, value);
    break;
  }
});

/* Sample output moving slider 1, 2 and pushing bank button starting on 4

m:176,4,89 d:47.114432
m:176,4,88 d:0.026334999999999997
m:176,4,86 d:0.026396
m:176,4,85 d:0.012627999999999999
m:176,4,84 d:0.01264
m:176,4,83 d:0.013862
m:176,4,82 d:0.02635
m:176,4,81 d:0.012624
m:176,4,80 d:0.038908
m:176,4,79 d:0.026400999999999997
m:176,4,78 d:0.052597
m:176,4,77 d:0.052607999999999995
m:176,3,55 d:0.69263
m:176,3,54 d:0.052636999999999996
m:176,3,53 d:0.038842999999999996
m:176,3,52 d:0.092595
m:176,3,51 d:0.025168
m:176,3,50 d:0.026375
m:176,3,49 d:0.040128
m:176,3,48 d:0.012636
m:176,3,46 d:0.026472
m:176,3,45 d:0.026362999999999998
m:176,3,44 d:0.025144999999999997
m:176,3,43 d:0.078883
m:240,66,64,0,1,4,0,95,79,1,247 d:1.7676079999999998
m:240,66,64,0,1,4,0,95,79,2,247 d:0.706341
m:240,66,64,0,1,4,0,95,79,3,247 d:0.354008
m:240,66,64,0,1,4,0,95,79,0,247 d:0.252483



*/

