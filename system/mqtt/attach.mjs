import mqtt from './';
// import deserialise from './deserialise';

// const onMessage = message => {
//   if (message.system !== 'mqtt') return;
//   switch (message.method) {
//     case 'publish':
//       const { topic, payload, options } = message;
//       mqtt.publish(topic, deserialise(payload), options);
//     break;
//   }
// }

export default (childProcess) => {
  // const publish = (packet) => {
  //   const { topic, payload, ...msg } = packet;
  //   childProcess.send({ system: 'mqtt', method: 'message', topic, payload, msg });
  // };
  // mqtt.on('published', publish);
  // childProcess.on('message', onMessage);
  // childProcess.on('exit', () => mqtt.off('published', publish));

  const socket = childProcess.stdio[4];

  if (socket) mqtt.handle(socket);

  return childProcess;
}

/*
TODO get mqtt server and run .handle on socket IPC - in the parent process stream to child.stdio[4].

create net.Socket with fd of 4
new net.Socket({ fd: 4, readable: true, writable: true })

create MQTT.js client connecting to this socket
const client = new mqtt.Client(() => new net.Socket({ fd: 4, readable: true, writable: true }), {});

This will behave the same as the web client. Client class with MQTTEmitter features can be applied

*/