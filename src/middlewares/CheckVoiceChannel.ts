import { Middleware } from "@core/contracts/Middleware";
import { Message } from "discord.js";
import { Client } from "@core/Client";
import { CommandException } from "@core/exceptions/CommandException";
import trans from "@core/utils/trans";

export class CheckVoiceChannel implements Middleware {
  run(message: Message, client: Client): Message {
    const user = message.member;
    const channel = user!.voice!.channel;
    if (!channel) throw new CommandException(message, trans("commands.USER_MUST_JOIN"));
    return message;
  }
}
