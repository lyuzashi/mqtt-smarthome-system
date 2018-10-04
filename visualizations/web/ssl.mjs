import createServer from 'auto-sni';
import app from './app';

const options = {
  email: 'ben@robotjamie.com',
  agreeTos: true, // Required for letsencrypt.
  debug: true, // Add console messages and uses staging LetsEncrypt server. (Disable in production)
  domains: ['hal9000.grid.robotjamie.com'], // List of accepted domain names. (You can use nested arrays to register bundles with LE).
  // dir: "~/letsencrypt/etc", // Directory for storing certificates. Defaults to "~/letsencrypt/etc" if not present.
  ports: {
    http: 80, // Optionally override the default http port.
    https: 443 // // Optionally override the default https port.
  }
}

export default createServer(options, app);

// Switch to this when not running on hal9000
// export default app.listen(8080);
