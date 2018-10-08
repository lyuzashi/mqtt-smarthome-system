import Hook from '@octokit/webhooks';
import app from '../web';
import secret from './git-hook-secret';
import update from './git-update';
import { now } from '../shutdown';
import { owner } from './repository';

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
})();

app.use((...request) => hook.then(({ middleware }) => middleware(...request)));

export default hook;