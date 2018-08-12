import git from 'isomorphic-git';
import fs from 'fs';

export default () => (
  git.pull({
    dir: '.',
    fs,
    ref: 'master',
    singleBranch: true
  })
);
