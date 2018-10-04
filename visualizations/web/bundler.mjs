import Bundler from 'parcel-bundler';
import path from 'path';
import app from './app';
import root from '../../root';

const bundler = new Bundler(
  path.resolve(root, 'visualizations/web/index.html'), {
  logLevel: 1,
});

app.use(bundler.middleware());

export default bundler;
