import Hook from '@octokit/webhooks';
import http from 'http';
import secret from './git-hook-secret';
import nat, { portChange } from '../nat';
import update from './git-update';
import { now } from '../shutdown';
import { owner } from './repository';

export const hook = new Hook({ secret });

hook.on('push', async ({ payload }) => {
  const { ref, pusher: { name }, repository: { master_branch } } = payload;
  if (name === owner) {
    console.log('Updating system');
    await update();
    now();
  }
})

export default (async () => {
  const { port } = await nat;
  const server = http.createServer(hook.middleware);
  server.listen(port);
  portChange(newPort => {
    server.close();
    server.listen(newPort);
  })
  return server;
})();
