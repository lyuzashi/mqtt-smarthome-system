import build, { registry } from './build';

import devicesData from '../../config/devices.yml';

import types from '../../config/types.yml';
import characteristics from '../../config/characteristics.yml';

export const devices = build({ devices: devicesData, types, characteristics });

export { types, characteristics };

export default registry;