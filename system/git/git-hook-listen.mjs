import Hook from '@octokit/webhooks';
import http from 'http';
import secret from './git-hook-secret';
import nat from '../nat';

export const hook = new Hook({ secret });

hook.on('push', ({id, name, payload}) => {
  console.log(name, 'event received', id, payload);
})

export default (async () => {
  const { port } = await nat;
  return http.createServer(hook.middleware).listen(port);
})();
