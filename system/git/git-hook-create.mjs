/* Update system automatically by watching GitHub repository
 */
import Octokit from '@octokit/rest';
import bug from 'debug';
import { owner, repo } from './repository';
import { get, set } from '../../config/keys';
import secret from './git-hook-secret';
import listen from './git-hook-listen';

const debug = bug('smarthome:system:git');

(async () => {
  const { 'github-hook-token': token, domain  } = await get();
  const url = `https://${domain}/github`;
  const octokit = new Octokit();

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
      secret: await secret,
      insecure_ssl: true,
      events: ['push'],
    }
  });

  await set('github-hook-id', hook_id);
})().catch(error => {
  debug('Failed to create GitHub webhook %s', error.message);
});

