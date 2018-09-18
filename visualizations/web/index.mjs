import Bundler from 'parcel-bundler';
import express from 'express';
import path from 'path';
import root from '../../root';

const app = express();

const file = path.resolve(root, 'visualizations/web/index.html')
const options = {}; // See options section of api docs, for the possibilities

// Initialize a new bundler using a file and options
const bundler = new Bundler(file, options);

setTimeout(() => {

// Let express use the bundler middleware, this will let Parcel handle every request over your express server
app.use(bundler.middleware());

// Listen on port 8080
app.listen(8080);

});

export default app;
