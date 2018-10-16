import mqtt from './';

const onMessage = message => {
  if (message.system !== 'mqtt') return;
  switch (message.method) {
    case 'publish':
      mqtt.publish(...message.args);
    break;
  }
}

export default (childProcess) => {
  const publish = (packet) => {
    const { topic, payload, ...msg } = packet;
    childProcess.send({ system: 'mqtt', method: 'message', args: [topic, payload, msg] });
  };
  mqtt.on('published', publish);
  childProcess.on('message', onMessage);
  childProcess.on('exit', () => mqtt.off('published', publish));
}