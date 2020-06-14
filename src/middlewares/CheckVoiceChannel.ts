import { Middleware } from "src/contracts/Middleware";
import { Message } from "discord.js";
import { Client } from "src/core/Client";
import { CommandException } from "src/exceptions/CommandException";
import trans from "src/utils/trans";

export class CheckVoiceChannel implements Middleware {
  run(message: Message, client: Client): Message {
    const user = message.member;
    const channel = user!.voice!.channel;
    if (!channel) throw new CommandException(message, trans("commands.USER_MUST_JOIN"));
    return message;
  }
}
