
const pendingUpdates = new WeakMap();

const ENQUEUED = Symbol('enqueued');

export default (device, fixture) => {
  // Device is the entire hue.lights object which is required to send the .save command to
  // Fixture is an individual light with changed attributes.
  // The goal of this function is to debounce the changes for any particular light (and perhaps
  // the entire hue interface?) so that only the last change in a quick succession is applied
  const queue = createQueue(device);
  queue.add(fixture);
  enqueueSave(device);
}

const createQueue = (device) => {
  if(pendingUpdates.has(device)) return pendingUpdates.get(device);
  const queue = new Set();
  Object.defineProperty(queue, ENQUEUED, { value: false, writable: true });
  pendingUpdates.set(device, queue);
  return queue;
}

const enqueueSave = (device) => {
  const queue = pendingUpdates.get(device);
  if (!queue) return;
  const enqueued = queue[ENQUEUED];
  if (enqueued) {
     console.log('Could not queue change, backed up', device, queue);
    return; // Rather than blocking, the last change should be saved for sending after queue drain
  }
  queue[ENQUEUED] = true;
  // This could also manage auto rate limiting (and open up the possibility of switching
  // to entertainment API automatically when rate is exceeded for compatible lights)
  // Queue should also remove duplicate changes and ensure last received value is definitely set
  // (avoid jumping backwards)
  setTimeout(() => {
    const fixtureQueue = [...queue];
    // queue[ENQUEUED] = false; // Allow further queuing while sending request
    // console.dir(fixtureQueue.map(fixture => 
    //   `${fixture.name}: ${Object.keys(fixture.state.changed).map(c => `${c}: ${fixture.state.attributes[c]}`)}`) );
    Promise.all(fixtureQueue.map(fixture => 
      device.save(fixture)
      // Catch 201 parameter, <parameter>, is not modifiable. Device is set to off.
      .catch(error => { if (error.type !== 201) throw error })
      .then(() => queue.delete(fixture))
    )).then(() => (queue[ENQUEUED] = false))
  })
}