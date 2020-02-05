import EtherportClient from './etherport-client';
import EventSource from './eventsource';

const protocols = {
  'etherport-client': EtherportClient,
  eventsource: EventSource,
}

const registry = new Map();

export default ({ type, device, ...options }) => {
  // find instance of interface by hub or create new instance
  if (options.hub && registry.has(options.hub)) {
    return registry.get(options.hub);
  }
  const instance = new protocols[type]({ ...options, device  });
  if (options.hub) {
    registry.set(options.hub, instance);
  }
  return instance;
}
