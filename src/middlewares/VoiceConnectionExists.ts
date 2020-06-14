import { Middleware } from "@core/contracts/Middleware";
import { Message } from "discord.js";
import { Client } from "@core/Client";
import { CommandException } from "@core/exceptions/CommandException";
import commands from "src/lang/ru/commands";

export class VoiceConnectionExists implements Middleware {
  run(message: Message, client: Client): Message {
    if (!client.connection) throw new CommandException(message, commands.VOICE_CONNECTION_NOT_FOUND.replace(":do", message.content));
    return message;
  }
}
