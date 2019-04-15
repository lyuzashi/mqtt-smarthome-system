import createServer from 'auto-sni';
import app from '../../system/web';

const options = {
  email: 'ben@robotjamie.com',
  agreeTos: true,
  domains: ['hal9000.grid.robotjamie.com'],
};

export default (process.env.NODE_ENV === 'production' ?
  createServer(options, app) :
  app.listen(process.env.PORT || 8080)
);
