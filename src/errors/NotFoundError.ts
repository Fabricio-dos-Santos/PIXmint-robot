export class NotFoundError extends Error {
  public readonly statusCode: number;
  constructor(message = 'not_found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export default NotFoundError;
