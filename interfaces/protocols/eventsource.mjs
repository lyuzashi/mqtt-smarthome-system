import EventSource from 'eventsource';
import objectPath from 'object-path';
import { Readable } from 'stream';

export default class EventSourceProtocol extends Readable {
  constructor({ hub, format, payload, device }) {
    console.log('creating esp', hub)
    super({ objectMode: true });
    const stream = new EventSource(hub);
    Object.assign(this, {
      stream,
      format,
      payload,
    })
  }
  
  _read() {
    this.stream.addEventListener('message', this.handleMessage.bind(this));
  }
  
  handleMessage(message) {
    const { data } = message;
    switch (this.format) {
      case 'json':
        this.push(objectPath.get(JSON.parse(data), this.payload));
      break;
    }
  }
}