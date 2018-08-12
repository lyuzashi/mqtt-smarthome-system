import git from 'isomorphic-git';
import fs from 'fs';

export default (ref) => (
  git.pull({
    dir: '.',
    fs,
    ref,
    singleBranch: true
  })
);
