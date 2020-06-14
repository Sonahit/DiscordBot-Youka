export class ConfigNotFoundException extends Error {
  constructor(message: string) {
    super(message);
  }
}
