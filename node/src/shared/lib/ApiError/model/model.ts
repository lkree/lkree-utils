export class ApiError<T> extends Error {
  status: number;
  errors: Array<Error>;
  events: Array<T>;

  constructor(status: number, message: string, errors: Array<Error> = [], events: Array<T> = []) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.events = events;
  }

  static BadRequest<T>(message: string, errors: Array<Error> = [], events: Array<T> = []) {
    return new ApiError<T>(400, message, errors, events);
  }

  static ServerError<T>(message: string, errors: Array<Error> = [], events: Array<T> = []) {
    return new ApiError<T>(500, message, errors, events);
  }
}
