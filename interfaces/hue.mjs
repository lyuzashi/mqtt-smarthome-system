import getClient from './hue/client';
import truthy from 'truthy';
import mqtt from '../system/mqtt';
import requestSave from './hue/request-save';

const characteristics = {
  on: {
    map: truthy,
    fix(light, lights) {
      switch(light.manufacturer) {
        case 'OSRAM':
          if (light.on === false) {
            lights.save(light);
            light.transitionTime = 0;
          }
        break;
      }
    }
  }, // truthy or falsy
  // TODO bound by range to allow out of bound maxing out
  brightness: { map: Number }, // 0-254
  hue: { map: Number }, // 0-65535
  saturation: { map: Number }, // 0-254
  colorTemp: { map: Number }, // 153-500
  transitionTime: { map: Number }, // 0-5s
  alert: { map: () => 'select' },
};

(async () => {

  const client = await getClient;

  const lights = await client.lights.getAll();
  const all = await client.groups.getById(0);

  lights.forEach(light => {
    console.log(light.name, light.brightness, light.colorTemp, light.hue)
    Object.keys(characteristics).forEach(characteristicName => {
      const characteristic = characteristics[characteristicName];
      mqtt.subscribe(`lights/set/${light.name}/${characteristicName}`,
        (topic, value) => {
          light[characteristicName] = characteristic.map(value);
          if (characteristic.fix) characteristic.fix(light, client.lights);
          requestSave(client.lights, light);
        });
      mqtt.subscribe(`lights/get/${light.name}/${characteristicName}`, async (topic) => {
        const state = await client.lights.getById(light.id);
        const value = state[characteristicName];
        mqtt.publish({
          topic: `lights/status/${light.name}/${characteristicName}`,
          payload: String(value),
        });
      });
    });
  });

  Object.keys(characteristics).forEach(characteristicName => {
    const characteristic = characteristics[characteristicName];
    mqtt.subscribe(`lights/set/all/${characteristicName}`,
      (topic, value) => {
        all[characteristicName] = characteristic.map(value);
        requestSave(client.groups, all);
        // Then follow up by setting each light individually with fixes applied
      });
  });

  // setInterval(async () => {
  //   const lights = await client.lights.getAll();
  //   lights.forEach(light => {
  //     // TODO store all values and publish if changed?
  //     console.log(light.name, light.brightness, light.colorTemp, light.hue)
  //   });
  //   // Slow down polling if data is coming from elsewhere
  // }, 300).unref();

})();
