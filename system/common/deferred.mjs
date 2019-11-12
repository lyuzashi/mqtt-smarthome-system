export default class Deferred {
  constructor() {
    this.resolved = false;
    this.rejected = false;
    this.settled = false;
    this.promise = new Promise((resolve, reject) => {
      Object.defineProperties(this, {
        resolvePromise: { value: resolve },
        rejectPromise: { value: reject },
      })
    });
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  resolve(...args) {
    this.resolved = true;
    this.settled = true;
    this.resolvePromise(...args);
    return args[0];
  }

  reject(...args) {
    this.rejected = true;
    this.settled = true;
    this.rejectPromise(...args);
    return args[0];
  }
}