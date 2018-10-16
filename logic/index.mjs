import { resolve } from 'path';
import root from '../root';
import fork from '../system/fork';
import Client from '../system/mqtt/client';

const mqttScripts = resolve(root, 'logic/mqtt-scripts.mjs');

new Client(fork(mqttScripts));
