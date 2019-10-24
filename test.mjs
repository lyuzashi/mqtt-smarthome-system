import repl from 'repl';
import hue from './interfaces/hue/client';
import discover from './system/discover';

const { context } = repl.start();

context.hue = hue;
context.discover = discover;
