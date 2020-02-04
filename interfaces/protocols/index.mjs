import EtherportClient from './etherport-client';
import EventSource from './eventsource';

const protocols = {
  'etherport-client': EtherportClient,
  eventsource: EventSource,
}

const registry = new Map();

export default ({ type, hub }) => {
  // find instance of interface by hub or create new instance
  if (hub && registry.has(hub)) {
    return registry.get(hub);
  }
  const instance = new protocols[type]({ hub });
  if(hub) {
    registry.set(hub, instance);
  }
  return instance;
}
