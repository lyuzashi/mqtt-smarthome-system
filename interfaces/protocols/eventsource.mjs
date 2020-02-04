import EventSource from 'eventsource';
import Readable from '../../system/common/readable';

export default class EventSourceProtocol extends Readable {
  constructor({ hub }) {
    super();
    const stream = new EventSource(hub);
    stream.addEventListener('message', this.enqueue.bind(this));
  }
}