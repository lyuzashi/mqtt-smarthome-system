import express from 'express';
import path from 'path';
import root from '../../root';
import { app } from './ws';

app.use('/config', express.static(path.resolve(root, 'config')));
