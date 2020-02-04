import { devices } from '../../system/devices';
import Location from './location-device';

devices.filter(({ hub, interfaces = [] }) =>
    interfaces.find(({ type }) => type === 'location'))
  .map(device => new Location(device));

