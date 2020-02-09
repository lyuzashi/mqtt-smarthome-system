import { devices } from '../../system/devices';
import DimmableLight from './dimmable-light';

devices.filter(({ type }) => type === 'dimmable light')
  .map(device => new DimmableLight(device));

