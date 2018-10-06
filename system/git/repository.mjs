import url from 'url';
import { basename, dirname } from 'path';
import project from '../../package.json';

const { repository: { url: repositoryUrl } } = project;
const { path: repositoryPath } = url.parse(repositoryUrl);
const repo = basename(repositoryPath, '.git');
const owner = basename(dirname(repositoryPath));
const path = `/${repo}`;

export { repo, owner, path };
