export default class GPIO {
  constructor({ id, mode, characteristics }) {

  }

  read() {
    // Async generator to await next event (all characteristics)
  }

  write() {
    // Delegate data to protocol
  }

  get() {
    // Retrieve latest cached value and callback with refresh method
  }

  status() {
    // Publish new raw event
    // Go through all characteristics and add events to queue as necessary
  }
}