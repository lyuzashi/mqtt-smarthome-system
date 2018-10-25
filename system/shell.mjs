import REPL from 'repl';
import EventEmitter from 'events';

class Context extends EventEmitter{
  constructor() {
    super();
    const self = this;
    return new Proxy(this, {
      set(target, property, value) {
        self.emit('set', { [property]: value });
        return Reflect.set(target, property, value);
      }
    });
  }
}

export const context = new Context();

export const start = ({ input = process.stdin, output = process.stdout } = {}) => {
  const repl = REPL.start({ prompt: '> ', input, output, terminal: true });
  Object.assign(repl.context, context);
  context.on('set', additionalContext => Object.assign(repl.context, additionalContext));
  return repl;
};
