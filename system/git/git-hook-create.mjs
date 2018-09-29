/* Update system automatically by watching GitHub repository
 */
import Octokit from '@octokit/rest';
import { owner, repo } from './repository';
import { get, set } from '../../config/keys';
import secret from './git-hook-secret';
import listen from './git-hook-listen';
import nat from '../nat';
import shutdown from '../shutdown';

// TODO handle ipChange and portChange events

(async () => {

  const { port, ip } = await nat;
  const url = `http://${ip}:${port}`;

  const octokit = new Octokit();
  const token = await get('github-hook-token');

  octokit.authenticate({ type: 'token', token });

  const { data: hooks } = await octokit.repos.getHooks({ owner, repo });
  const existingHook = hooks.find(({config: { url: existingUrl }}) => url === existingUrl);

  if (existingHook) return;

  await listen;

  const { data: { id: hook_id } } = await octokit.repos.createHook({
    owner,
    repo,
    name: 'web',
    config: {
      url, 
      content_type: 'json',
      secret,
      insecure_ssl: true,
      events: ['push'],
    }
  });

  await set('github-hook-id', hook_id);

  shutdown.on('exit', () => 
    octokit.repos.deleteHook({
      owner,
      repo,
      hook_id,
    })
  );

})();