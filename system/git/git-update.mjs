import Git from 'simple-git/promise';
import root from '../../root';

export const git = Git(root);

/* This could be smarter by fetching and merging the specific commit the hook
triggered, but for all intents and purposes, this is the same thing */
export default () => (
  git.pull()
);
