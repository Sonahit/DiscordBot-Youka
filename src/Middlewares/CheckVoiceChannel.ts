import { Middleware } from "src/Contracts/Middleware";
import { Message } from "discord.js";
import { Client } from "src/Core/Client";
import { CommandException } from "src/Exceptions/CommandException";
import commands from "src/lang/ru/commands";

export class CheckVoiceChannel implements Middleware {
  run(message: Message, client: Client): Message {
    const user = message.member;
    const channel = user!.voice!.channel;
    if (!channel) throw new CommandException(message, commands.USER_MUST_JOIN);
    return message;
  }
}
