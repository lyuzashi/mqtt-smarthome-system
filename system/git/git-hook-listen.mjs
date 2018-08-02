import Hook from '@octokit/webhooks';
import http from 'http';
import secret from './git-hook-secret';
import nat from '../nat';

export const hook = new Hook({ secret });

hook.on('*', ({id, name, payload}) => {
  console.log(name, 'event received')
})

export default (async () => {
  const { port } = await nat;
  console.log('listen on', port, secret);
  return http.createServer(hook.middleware).listen(port); // callback?
})();
