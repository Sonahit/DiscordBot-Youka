export class BotRuntimeException extends Error {
  constructor(content: string) {
    super(content);
  }

  getContent(): string {
    return this.message;
  }
}
