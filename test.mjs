import repl from 'repl';
import hue from './interfaces/hue/client';

const { context } = repl.start();

context.hue = hue;
