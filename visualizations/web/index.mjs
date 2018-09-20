import Bundler from 'parcel-bundler';
import express from 'express';
import path from 'path';
import root from '../../root';

const app = express();

const bundler = new Bundler(
  path.resolve(root, 'visualizations/web/index.html'), {
  logLevel: 1,
});

// Defer bundler middleware to allow other modules a chance to register routes
setTimeout(() => {
  app.use(bundler.middleware());
  app.listen(8080);
});

export default app;
