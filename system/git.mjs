/* Update system automatically by watching GitHub repository
 */
import octokit from '@octokit/rest';
import keys from '../config/keys';

const octokit = new Octokit();
const { 'github-hook-token': token } = await keys;

octokit.authenticate({ type: 'token', token });

const hooks = await octokit.repos.getHooks({ owner, repo }) // parse these from repo in package.json