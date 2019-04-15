import osc from 'osc';
import serialport from 'serialport';
import mqtt from '../../system/mqtt';

(async () => {
  const ports = await serialport.list();

  /*
  {
    comName: '/dev/tty.usbmodem1421',
    manufacturer: 'Arduino (www.arduino.cc)',
    serialNumber: '752303138333518011C1',
    pnpId: undefined,
    locationId: '14500000',
    productId: '0043',
    vendorId: '2341'
  }
  */

  const port = new osc.SerialPort({
    devicePath: '/dev/tty.usb', // TODO find serial port
    metadata: true,
  });
  
  
  port.open();

  mqtt.subscribe(`*`, (topic) => {
    port.send({
      address: "/s_new",
      args: [
          {
              type: "s",
              value: "default"
          },
          {
              type: "i",
              value: 100
          }
      ]
    });
  });
  
  port.on("message", function (oscMsg, timeTag, info) {
    console.log("An OSC message was received!", oscMsg);
    mqtt.publish({
      topic: `lights/status/${light.name}/${characteristicName}`,
      payload: String(value),
    });
  });
  


})();

