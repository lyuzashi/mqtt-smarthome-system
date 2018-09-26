import getClient from './client';
import mqtt from '../../system/mqtt';
import requestSave from './request-save';
import characteristics from './characteristics';

(async () => {
  const client = await getClient;

  setInterval(async () => {
    const lights = await client.lights.getAll();
    lights.forEach(light => {
      // TODO store all values and publish if changed?
      console.log(light.name, light.brightness, light.colorTemp, light.hue)
       // Assign to existing light.state, identifing by id
      // light.state.replace(newState);
      // go through all characteristics and for each that are different, publish
      // subscribe to status to keep in-memory up to date
    });
    // Slow down polling if data is coming from elsewhere
  }, 300).unref();

})();
