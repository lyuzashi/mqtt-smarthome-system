import Bundler from 'parcel-bundler';
import path from 'path';
import bug from 'debug';
import app from '../../system/web';
import root from '../../root';

const debug = bug('smarthome:visualizations:web:bundler');

const bundler = new Bundler(
  path.resolve(root, 'visualizations/web/index.html'), {
  logLevel: 1,
});

bundler.on('bundled', () => debug('Finished bundling web interface'));
bundler.on('buildStart', () => debug('Started bundling web interface'));
bundler.on('buildError', error => debug('Error bundling web interface %o', error));

app.use(bundler.middleware());

export default bundler;
