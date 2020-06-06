import { Middleware } from "src/Contracts/Middleware";
import { Message } from "discord.js";
import { Client } from "src/Core/Client";
import { CommandException } from "src/Exceptions/CommandException";
import commands from "src/lang/ru/commands";

export class DispatcherNotExists implements Middleware {
  run(message: Message, client: Client): Message {
    if (client.dispatcher) throw new CommandException(message, commands.DISPATCHER_FOUND_ERROR);
    return message;
  }
}
