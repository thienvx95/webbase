
 export class NotBootstrappedError extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, NotBootstrappedError.prototype);
  
      this.name = 'NotBootstrappedError';
      this.message = `Cannot shutdown microframework because its not bootstrapped yet.`;
    }
  }
  