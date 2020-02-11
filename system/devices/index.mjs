import YAML from 'yamljs';
import path from 'path';

import root from '../../root';
import { context } from '../shell'; 
import build, { registry } from './build';

// TODO rely on parcel bundler to import these in that context, sharing device construction code
// in another file
const devicesData = YAML.load(path.resolve(root, 'config/devices.yml'));

export const types = YAML.load(path.resolve(root, 'config/types.yml'));
export const characteristics = YAML.load(path.resolve(root, 'config/characteristics.yml'));

export const devices = build({ devices: devicesData, types, characteristics });

context.devices = devices;

export default registry;