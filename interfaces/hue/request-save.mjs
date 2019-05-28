import assign from 'assign-deep';

const pendingUpdates = new WeakMap();
const latestState = new Map();

const ENQUEUED = Symbol('enqueued');
const PENDING = Symbol('pending');
const THROTTLED = Symbol('throttled');

const attributeMap = {
  on: 'on',
  bri: 'brightness',
  colormode: 'colorMode',
  hue: 'hue',
  sat: 'saturation',
  xy: 'xy',
  ct: 'colorTemp',
  alert: 'alert',
  effect: 'effect',
  transitiontime: 'transitionTime',
  bri_inc: 'incrementBrightness',
  hue_inc: 'incrementHue',
  sat_inc: 'incrementSaturation',
  xy_inc: 'incrementXy',
  ct_inc: 'incrementColorTemp',
};

const shallowState = light => Object.keys(light.state.changed).reduce((attributes, attribute) =>
  Object.assign(attributes, { [attributeMap[attribute]]: light.state.attributes[attribute] }), {});

const updateAttributes = light => {
  const attributes = latestState.get(light);
  return Object.keys(attributes).reduce((changed, attribute) => {
    const value = attributes[attribute];
    if (light[attribute] !== value) {
      light[attribute] = value;
      return true;
    }
    return changed;
  }, false);
}

export default (device, fixture) => {
  // Device is the entire hue.lights object which is required to send the .save command to
  // Fixture is an individual light with changed attributes.
  const queue = createQueue(device);
  latestState.set(fixture, shallowState(fixture)); // Only necessary if queue is enqueued?
  queue.add(fixture);
  enqueueSave(device);
}

const createQueue = (device) => {
  if(pendingUpdates.has(device)) return pendingUpdates.get(device);
  const queue = new Set();
  Object.defineProperty(queue, ENQUEUED, { value: false, writable: true });
  Object.defineProperty(queue, PENDING, { value: false, writable: true });
  Object.defineProperty(queue, THROTTLED, { value: false, writable: true });
  pendingUpdates.set(device, queue);
  return queue;
}

const enqueueSave = (device) => {
  const queue = pendingUpdates.get(device);
  if (!queue) return;
  const enqueued = queue[ENQUEUED];
  if (enqueued) {
     // Flag that changes have been made while requests are in flight
    queue[THROTTLED] = true;
    return;
  }
  queue[ENQUEUED] = true;
  // This could also manage auto rate limiting (and open up the possibility of switching
  // to entertainment API automatically when rate is exceeded for compatible lights)
  setTimeout(() => {
    const fixtureQueue = [...queue];
    Promise.all(fixtureQueue.map(fixture => 
      device.save(fixture)
      // Catch 201 parameter, <parameter>, is not modifiable. Device is set to off.
      .catch(error => { if (error.type !== 201) throw error })
      .then(() => {
        if(updateAttributes(fixture)) {
          console.log('running final update', latestState.get(fixture));
          queue[PENDING] = true;
        } else {
          queue.delete(fixture);
        }
      })
    )).then(() => {
      queue[ENQUEUED] = false
      if(queue[PENDING]) {
        enqueueSave(device);
      }
      queue[PENDING] = false;
    })
  })
}
