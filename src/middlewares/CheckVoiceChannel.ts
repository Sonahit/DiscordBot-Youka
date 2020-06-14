import { Middleware } from "src/contracts/Middleware";
import { Message } from "discord.js";
import { Client } from "src/core/Client";
import { CommandException } from "src/exceptions/CommandException";
import commands from "src/lang/ru/commands";

export class CheckVoiceChannel implements Middleware {
  run(message: Message, client: Client): Message {
    const user = message.member;
    const channel = user!.voice!.channel;
    if (!channel) throw new CommandException(message, commands.USER_MUST_JOIN);
    return message;
  }
}
