export class ValidationError extends Error {
  public readonly statusCode: number;
  public readonly errors: string[];

  constructor(errors: string[] = []) {
    super('validation_error');
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

export default ValidationError;
