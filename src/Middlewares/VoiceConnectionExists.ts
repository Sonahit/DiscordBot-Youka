import { Middleware } from "src/Contracts/Middleware";
import { Message } from "discord.js";
import { Client } from "src/Core/Client";
import { CommandException } from "src/Exceptions/CommandException";
import commands from "src/lang/ru/commands";

export class VoiceConnectionExists implements Middleware {
  run(message: Message, client: Client): Message {
    if (!client.connection) throw new CommandException(message, commands.VOICE_CONNECTION_NOT_FOUND.replace(":do", message.content));
    return message;
  }
}
