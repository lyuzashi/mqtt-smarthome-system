import greenlock from 'greenlock-express';
import bug from 'debug';
import app from '../../system/web';
import root from '../../root';

const debug = bug('smarthome:visualizations:web')

const options = {
  package: { name: "mqtt-smarthome-system", version: "0.0.1" },
  maintainerEmail: 'ben@robotjamie.com',
  packageRoot: root,
  staging: false,
};

const createServer = (options, app) => {
  let server;
  greenlock.init(() => options)
  .serve(glx => {
    glx.httpServer().listen(process.env.PORT || 80);
    server = glx.httpsServer(null, app).listen(443);
  });
  return server;
}

const server = (() => {
  if (!process.env.NO_WEB_SERVER) {
    const server = (process.env.NODE_ENV === 'production' ?
      createServer(options, app) :
      app.listen(process.env.PORT || 8080)
    );

    server.once('listening', () => {
      debug('Web server listening on %d', server.address().port);
    })
    return server;
  }
})();

export default server;
