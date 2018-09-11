import hue from 'huejay';
import truthy from 'truthy';
import mqtt from '../system/mqtt';
import keys, { set } from '../config/keys';

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
  brightness: {
    map: Number,
    fix(light) {
      light.on = true;
    }
  }, // 0-254
  hue: { map: Number }, // 0-65535
  saturation: { map: Number }, // 0-254
  colorTemp: { map: Number }, // 153-500
  transitionTime: { map: Number }, // 0-5s
  alert: { map: () => 'select' },
};

(async () => {
  const { 'hue-username': username, 'hue-ip': lastKnownIP } = await keys;
  // Ping stored IP address if there is one, failing either case discover first bridge on network
  const host = (lastKnownIP && await new hue.Client({ host: lastKnownIP })
    .bridge.ping().catch(() => false) && lastKnownIP) || ((await hue.discover())[0].ip);
  await set('hue-ip', host);

  const client = new hue.Client({ username, host });

  // Test authentication and create user if it fails
  try {
    await client.bridge.isAuthenticated();
  } catch {
    mqtt.publish({ topic: 'system/hue/needs-link-button', payload: 1, qos: 1, retain: true });
    const newUser = new client.users.User({ deviceType: 'mqtt-smarthome-system' });
    let user;
    do {
      user = await client.users.create(newUser).catch(error =>
        (error instanceof hue.Error && error.type === 101) ? false : Promise.reject(error));
      await new Promise(resolve => setTimeout(resolve, 5000));
    } while(!user);
    mqtt.publish({ topic: 'system/hue/needs-link-button', payload: 0 });
    client.username = user.username;
    await set('hue-username', user.username);
  }

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
          client.lights.save(light);
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
        client.groups.save(all);
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
