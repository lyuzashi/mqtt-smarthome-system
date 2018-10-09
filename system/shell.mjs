import REPL from 'repl';

export const context = {};

export const start = ({ input = process.stdin, output = process.stdout }) => {
  const repl = REPL.start({ prompt: '> ', input, output, terminal: true, useGlobal: true });
  Object.assign(repl.context, context);
  return repl;
};
