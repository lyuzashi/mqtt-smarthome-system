import Firmata from './firmata';
import { devices } from '../../system/devices';

const firmataDevices = 
  devices.
    filter(({ interface: interfaces }) =>
      interfaces && interfaces
      .find(({ type }) => type === 'firmata' ))
    .map(device => new Firmata( device ));

    // TODO create new device instead and use the firmata instance as the interface
    // the the topics and async message queues get added