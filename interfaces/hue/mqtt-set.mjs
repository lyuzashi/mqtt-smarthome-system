import getClient from './client';
import mqtt from '../../system/mqtt';
import requestSave from './request-save';
import characteristics from './characteristics';

(async () => {
  const client = await getClient;
  const lights = await client.lights.getAll();

  lights.forEach(light => {
    Object.keys(characteristics).forEach(characteristicName => {
      const characteristic = characteristics[characteristicName];
      if (characteristic.immutable) return;
      mqtt.subscribe(`lights/set/${light.name}/${characteristicName}`,
        (topic, value) => {
          console.log(topic, value.toString());
          light[characteristicName] = characteristic.map(value);
          if (characteristic.fix) characteristic.fix(light, client.lights);
          requestSave(client.lights, light);
        });
    });
  });

})();
