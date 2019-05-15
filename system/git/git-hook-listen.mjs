import Hook from '@octokit/webhooks';
import bug from 'debug';
import app from '../web';
import secret from './git-hook-secret';
import update from './git-update';
import { now } from '../shutdown';
import { owner } from './repository';

const debug = bug('smarthome:system:git');

const hook = (async () => {
  const hook = new Hook({ secret: await secret, path: '/github' });
  
  hook.on('push', async ({ payload }) => {
    const { ref, pusher: { name }, repository: { master_branch } } = payload;
    if (name === owner) {
      console.log('Updating system');
      await update();
      now();
    }
  })

  return hook;
})().catch((error) => {
  debug('Could not set up GitHub webhook %o', error);
});

app.use((...request) => hook.then(({ middleware }) => middleware(...request)).catch(() => request[2]()));

export default hook;
