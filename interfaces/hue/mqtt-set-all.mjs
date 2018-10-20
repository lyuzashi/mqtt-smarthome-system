import getClient from './client';
import mqtt from '../../system/mqtt';
import requestSave from './request-save';
import characteristics from './characteristics';

(async () => {
  const client = await getClient;
  const all = await client.groups.getById(0);

  Object.keys(characteristics).forEach(characteristicName => {
    const characteristic = characteristics[characteristicName];
    mqtt.subscribe(`lights/set/hue/${characteristicName}`,
      (topic, value) => {
        all[characteristicName] = characteristic.map(value);
        requestSave(client.groups, all);
        // TODO Then follow up by setting each light individually with fixes applied
      });
  });

})();
