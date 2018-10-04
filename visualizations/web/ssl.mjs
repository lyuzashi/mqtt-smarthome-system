import createServer from 'auto-sni';
import app from './app';

const options = {
  email: 'ben@robotjamie.com',
  agreeTos: true,
  domains: ['hal9000.grid.robotjamie.com'],
};

export default createServer(options, app);

// Switch to this when not running on hal9000
// export default app.listen(8080);
