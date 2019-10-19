import createServer from 'auto-sni';
import bug from 'debug';
import app from '../../system/web';

const debug = bug('smarthome:visualizations:web')

const options = {
  email: 'ben@robotjamie.com',
  agreeTos: true,
  domains: ['hal9000.grid.robotjamie.com'],
};

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
