import osc from 'osc';
import serialport from 'serialport';
// import mqtt from '../../system/mqtt';

(async () => {
  const ports = await serialport.list();
  const neotrellis = (ports.find(port => port.vendorId === '239a' && port.productId === '802f') || {}).comName;

  const port = new osc.SerialPort({
    devicePath: neotrellis, // TODO find serial port
    metadata: true,
    bitrate: 115200,
  });

  port.open();

  // console.log(port);

  // mqtt.subscribe(`*`, (topic) => {
  //   port.send({
  //     address: "/s_new",
  //     args: [
  //         {
  //             type: "s",
  //             value: "default"
  //         },
  //         {
  //             type: "i",
  //             value: 100
  //         }
  //     ]
  //   });
  // });
  
  port.on("message", function (oscMsg, timeTag, info) {
    console.log("An OSC message was received!", oscMsg, timeTag, info);
  //   mqtt.publish({
  //     topic: `lights/status/${light.name}/${characteristicName}`,
  //     payload: String(value),
  //   });
  });
  


})();

