
const pendingUpdates = new WeakMap();

const ENQUEUED = Symbol('enqueued');

export default (device, fixture) => {
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
  if (enqueued) return;
  queue[ENQUEUED] = true;
  // This could also manage auto rate limiting (and open up the possibility of switching
  // to entertainment API automatically when rate is exceeded for compatible lights)
  setTimeout(() => {
    Promise.all([...queue].map(fixture => 
      device.save(fixture)
      // Catch 201 parameter, <parameter>, is not modifiable. Device is set to off.
      .catch(error => { if (error.type !== 201) throw error })
      .then(() => queue.delete(fixture))
    )).then(() => (queue[ENQUEUED] = false))
  })
}