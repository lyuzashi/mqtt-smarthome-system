import url from 'url';
import path from 'path';
import project from '../../package.json';

const { repository: { url: repositoryUrl } } = project;
const { path: repositoryPath } = url.parse(repositoryUrl);
const repo = path.basename(repositoryPath, '.git');
const owner = path.basename(path.dirname(repositoryPath));

export { repo, owner };
