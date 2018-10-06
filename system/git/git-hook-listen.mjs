import Hook from '@octokit/webhooks';
import http from 'http';
import secret from './git-hook-secret';
import { get } from '../../config/keys';
import update from './git-update';
import { now } from '../shutdown';
import { owner } from './repository';

export default (async () => {
  
  const hook = new Hook({ secret: await secret, path: '/github' });
  
  hook.on('push', async ({ payload }) => {
    const { ref, pusher: { name }, repository: { master_branch } } = payload;
    if (name === owner) {
      console.log('Updating system');
      await update();
      now();
    }
  })

  // const { port } = await nat;
  // const server = http.createServer(hook.middleware);
  // server.listen(port);
  // portChange(newPort => {
  //   server.close();
  //   server.listen(newPort);
  // })
  return hook;
})();
