import mqtt from './';
import deserialise from './deserialise';

const onMessage = message => {
  if (message.system !== 'mqtt') return;
  switch (message.method) {
    case 'publish':
      const { topic, payload, options } = message;
      mqtt.publish(topic, deserialise(payload), options);
    break;
  }
}

export default (childProcess) => {
  const publish = (packet) => {
    const { topic, payload, ...msg } = packet;
    childProcess.send({ system: 'mqtt', method: 'message', topic, payload, msg });
  };
  mqtt.on('published', publish);
  childProcess.on('message', onMessage);
  childProcess.on('exit', () => mqtt.off('published', publish));
  return childProcess;
}