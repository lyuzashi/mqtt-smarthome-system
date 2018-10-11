import root from '../../root';
import app from '../../system/web';
import express from 'express';
import { resolve } from 'path';

app.use(express.static(resolve(root, 'node_modules/monaco-editor/min/')));
