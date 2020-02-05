import EventSource from 'eventsource';
import { Readable } from 'stream';
// import Readable from '../../system/common/readable';

export default class EventSourceProtocol extends Readable {
  constructor({ hub }) {
    super({ objectMode: true });
    this.stream = new EventSource(hub);
  }
  
  _read() {
    this.stream.addEventListener('message', this.handleMessage.bind(this));
  }
  
  handleMessage(message) {
    // TOOO decode data according to options
    this.push(message);
  }
}