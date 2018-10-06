/* Update system automatically by watching GitHub repository
 */
import Octokit from '@octokit/rest';
import { parse } from 'url';
import { owner, repo } from './repository';
import { get, set } from '../../config/keys';
import secret from './git-hook-secret';
import listen from './git-hook-listen';
import { getIp, getPort, customPort } from '../nat';
import { path } from './repository';
import shutdown from '../shutdown';
import Deferred from '../common/deferred';

// TODO handle ipChange and portChange events

(async () => {

  const getExistingPort = new Deferred();
  customPort(getExistingPort.promise);

  const octokit = new Octokit();
  const token = await get('github-hook-token');

  octokit.authenticate({ type: 'token', token });

  const { data: hooks } = await octokit.repos.getHooks({ owner, repo });
  const existingHook = hooks.find(({config: { url: existingUrl }}) => existingUrl.match(path));

  const existingPort = existingHook && parse(existingHook.config.url).port; //existingHook
  getExistingPort.resolve(existingPort);

  if (existingHook) return;

  const port = await getPort;
  const ip = await getIp;
  const url = `http://${ip}:${port}${path}`;

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