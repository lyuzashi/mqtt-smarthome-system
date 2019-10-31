export default class Deferred {
  constructor() {
    this.resolved = false;
    this.rejected = false;
    this.settled = false;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.promise
      .then(() => this.resolved = true)
      .catch(() => this.rejected = true)
      .then(() => this.settled = true);
  }
}