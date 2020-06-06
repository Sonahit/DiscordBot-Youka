import { CommandException } from "src/Exceptions/CommandException";
import { BotRuntimeException } from "src/Exceptions/BotRuntimeException";
import { Message } from "discord.js";
import { ResponseEmoji } from "./Enums/ResponseEmoji";

export class ErrorHandler {
  static handle(message: Message, e: any) {
    let stringError = "";
    if (e instanceof CommandException) {
      const errorMessage = e.getClientMessage();
      errorMessage.channel.send(e.message);
      stringError = e.message;
    } else if (e instanceof BotRuntimeException) {
      stringError = e.getContent();
    } else if (e instanceof Error) {
      stringError = e.message;
    } else {
      stringError = e;
    }
    message.reactions.removeAll().then(() => message.react(ResponseEmoji.NOT_OK));
    logger.error(stringError);
  }
}
