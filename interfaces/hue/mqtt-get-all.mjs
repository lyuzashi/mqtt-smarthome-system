import getClient from './client';
import mqtt from '../../system/mqtt';
import characteristics from './characteristics';

const states = new Map();

const createState = (id) => {
  if(states.has(id)) return states.get(id);
  const state = {};
  states.set(id, state);
  return state;
}

const stateCharacteristics = Object.keys(characteristics).filter(characteristic =>
  !characteristics[characteristic].stateless);

(async () => {
  const client = await getClient;

  // Subscribe to all status topics, measure age and only get if they are all not updated for a while
  // also use these existing status' to diff new data from getAll
  // publish with retain

  setInterval(async () => {
    const lights = await client.lights.getAll();
    lights.forEach(light => {
      const state = createState(light.id);
      stateCharacteristics.forEach(characteristic => {
        const before = state[characteristic];
        const after = light[characteristic];
        if (before !== after) {
          mqtt.publish({
            topic: `lights/status/${light.name}/${characteristic}`,
            payload: String(after),
            retain: true,
          });
          state[characteristic] = after;
        }
      });
    });
    // Slow down polling if data is coming from elsewhere
  }, 300).unref();

})();
