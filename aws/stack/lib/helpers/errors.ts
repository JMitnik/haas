
export class BaseError extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class JSONInputError extends BaseError {
  missingProperty: string;

  constructor(property: string) {
    super(`Input: Missing ${property} in body`);
    this.missingProperty = property;
  }
}

export class NetworkError extends BaseError {
  callbackUrl: string;

  constructor(callbackUrl: string, message: string) {
    super(message);
    this.callbackUrl = callbackUrl;
  }
}

export class APIError extends NetworkError {
  constructor(callbackUrl: string, callbackMessage: string) {
    super(callbackUrl, `Error text: ${callbackMessage}`);
    Error.captureStackTrace(this, this.constructor);
  }
}
