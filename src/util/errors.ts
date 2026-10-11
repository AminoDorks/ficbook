export class FicbookError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FicbookError';
  }
}
