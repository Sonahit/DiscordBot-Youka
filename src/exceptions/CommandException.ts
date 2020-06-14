import { DiscordException } from "src/contracts/DiscordException";
import { Message } from "discord.js";

export class CommandException extends Error implements DiscordException {
  clientMessage: Message;

  constructor(message: Message, content: string) {
    super(content);
    this.clientMessage = message;
  }

  getClientMessage(): Message {
    return this.clientMessage;
  }
}
