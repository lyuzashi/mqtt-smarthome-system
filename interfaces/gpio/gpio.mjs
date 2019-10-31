const transform = (x) => {
  console.log(x);
}

export default class GPIO {
  constructor({ id, mode, characteristics }) {

  }

  async *read() {
    // Async generator to await next event (all characteristics)
  }

  write() {
    // Delegate data to protocol
  }

  get() {
    // Retrieve latest cached value and callback with refresh method
  }

  status(data) {
    this.characteristics.forEach(({ logic = [{ name: 'raw' }], methods, type }) => {
      methods.filter(({ method }) => method === 'status').forEach(({ topic }) => {
        for (const options of logic) {
          // TODO chain transformers so only the last one sends
          transform({ data, options, type, read: this.read.bind(this) });
        }
      });
    });
  }
}