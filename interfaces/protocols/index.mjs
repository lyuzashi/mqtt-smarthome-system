import EtherportClient from './etherport-client';
import EventSourceProtocol from './eventsource';
import OverlandProtocol from './overland.mjs';
import FirmataProtocol from './firmata';
import FirmataLight from './firmata-light';

const protocols = {
  'etherport-client': EtherportClient,
  eventsource: EventSourceProtocol,
  overland: OverlandProtocol,
  firmata: FirmataProtocol,
  'firmata-light': FirmataLight,
}

const registries = new WeakMap();

export default ({ type, hub, device, ...options }) => {

  const protocol = protocols[type];
  if (protocol.perHub) {
    if (!registries.has(protocol)) registries.set(protocol, new Map());
    const registry = registries.get(protocol);
    // find instance of interface by hub or create new instance
    if (hub && registry.has(hub)) return registry.get(hub);
    const instance = new protocols[type]({ ...options, hub, device  });
    if (hub) registry.set(hub, instance);
    return instance;
  }
  // Create new instance
  return new protocols[type]({ ...options, hub, device  });;
}
