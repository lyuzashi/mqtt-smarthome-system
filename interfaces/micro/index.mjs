import Firmata from './firmata';
import { devices } from '../../system/devices';

const firmataDevices = 
  devices.
    filter(({ interface: interfaces }) =>
      interfaces && interfaces
      .find(({ type }) => type === 'firmata' ))
    .map(device => new Firmata( device ));
