import Readable from '../../system/readable';

const transform = ({     
       data,
  options,
  type,
  topic,
  enqueue,
  previousValue,
  queueAtEnd}) => {
  // console.log(data, type, topic, options);
  return { data };
}

export default class GPIO extends Readable {
  constructor({ id, mode, characteristics }) {
    super();
    Object.assign(this, characteristics);
  }

  previousValue = undefined;

  // This will be in Readable class
  // async *read() {
    // Async generator to await next event (all characteristics)
  // }


  write() {
    // Delegate data to protocol
  }

  get() {
    // Retrieve latest cached value and callback with refresh method
  }

  // Characteristic handling could be subclassed
  status(data) {
    this.characteristics.forEach(({ logic = [{ name: 'raw' }], methods, type }) => {
      methods.filter(({ method }) => method === 'status').forEach(({ topic }) => {
        let transformedQueueAtEnd = true;
        let transformedData = data;
        for (const options of logic) {
          // TODO chain transformers so only the last one sends
          // Allow modification of data, queueAtEnd
          ({ 
            data: transformedData = transformedData, 
            queueAtEnd: transformedQueueAtEnd = transformedQueueAtEnd 
          } = transform({
            options,
            type,
            topic,
            data: transformedData,
            previousValue: this.previousValue,
            enqueue: this.enqueue.bind(this),
            queueAtEnd: transformedQueueAtEnd
          }));
        }
        if (transformedQueueAtEnd) {
          this.enqueue({ topic, payload: data });
        }
      });
    });
  }
}