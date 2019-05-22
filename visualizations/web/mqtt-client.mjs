import mqtt from 'mosca/public/mqtt';
import EventEmitter from 'events';

const subscriptions = new Map();
const url = new URL('/mqtt', window.location.href);
url.protocol = url.protocol.match(/s:$/) ? 'wss' : 'ws';

export const client = mqtt.connect(url.href);

client.on('message', (topic, payload) => {
  if (subscriptions.has(topic)) {
    const { subscription } = subscriptions.get(topic);
    subscription.emit('change', Buffer.from(payload).toString());
  }
});

export const subscribe = topic => {
  if (subscriptions.has(topic)) return subscriptions.get(topic).onChange;
  client.subscribe(topic);
  const subscription = new EventEmitter();
  const onChange = callback => subscription.on('change', callback);
  subscriptions.set(topic, { subscription, onChange});
  return onChange;
}

export const unsubscribe = (topic, ...callbacks) => {
  if (!subscriptions.has(topic)) return;
  const { subscription } = subscriptions.get(topic);
  callbacks.forEach(callback => subscription.removeListener(topic, callback));
  if (subscription.listenerCount() === 0) {
    subscriptions.delete(topic);
    client.unsubscribe(topic);
  }
}

export const publish = client.publish.bind(client);
