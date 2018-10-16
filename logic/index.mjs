import { resolve } from 'path';
import root from '../root';
import fork from '../system/fork';
import attach from '../system/mqtt/attach';

attach(fork(resolve(root, 'logic/mqtt-scripts.mjs')));
