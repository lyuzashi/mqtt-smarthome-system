// Note: consider using https://github.com/octokit/webhooks.js (offical GitHub kit)

import githubhook from 'githubhook';
import nat from '../nat';

nat.then(({ port }) => {
  const github = githubhook({
    port: 0,
    secret: '',
  });
  
  github.on('push:reponame:master', function (data) {
  });

  github.listen();
})

// if you'd like to programmatically stop listening
// github.stop();
