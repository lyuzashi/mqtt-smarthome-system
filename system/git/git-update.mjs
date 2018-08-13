import Git from 'simple-git/promise';

export const git = Git();

/* This could be smarter by fetching and merging the specific commit the hook
triggered, but for all intents and purposes, this is the same thing */
export default () => (
  git.pull()
);
