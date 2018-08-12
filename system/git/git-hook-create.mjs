/* Update system automatically by watching GitHub repository
 */
import Octokit from '@octokit/rest';
import { owner, repo } from './repository';
import keys from '../../config/keys';
import secret from './git-hook-secret';
import listen from './git-hook-listen';
import nat from '../nat';
import shutdown from '../shutdown';

(async () => {

  const { port, ip } = await nat;
  const url = `http://${ip}:${port}`;

  const octokit = new Octokit();
  const { 'github-hook-token': token } = await keys;

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

  shutdown.on('exit', () => 
    octokit.repos.deleteHook({
      owner,
      repo,
      hook_id,
    })
  );

})();