/* Update system automatically by watching GitHub repository
 */
import Octokit from '@octokit/rest';
import { owner, repo } from './repository';
import keys from '../../config/keys';

(async () => {

  const octokit = new Octokit();
  const { 'github-hook-token': token } = await keys;

  octokit.authenticate({ type: 'token', token });

  const { data: hooks } = await octokit.repos.getHooks({ owner, repo });

  console.log(hooks);

})();