import getClient from './client';
import mqtt from '../../system/mqtt';
import requestSave from './request-save';
import characteristics from './characteristics';

(async () => {
  const client = await getClient;

  const lights = await client.lights.getAll();
  const all = await client.groups.getById(0);

  lights.forEach(light => {
    Object.keys(characteristics).forEach(characteristicName => {
      const characteristic = characteristics[characteristicName];
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

})();
