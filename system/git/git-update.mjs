import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';

const dir = path.resolve('.'); // Pwd, might need to be more smart to find project root

export default (async () => {
  const x = await git.pull({
    dir: '.',
    fs,
    ref: 'master',
    singleBranch: true
  })
  console.log('x');
})();
