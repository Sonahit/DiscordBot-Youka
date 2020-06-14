import { Middleware } from "src/contracts/Middleware";
import { Message } from "discord.js";
import { Client } from "src/core/Client";
import { CommandException } from "src/exceptions/CommandException";
import commands from "src/lang/ru/commands";

export class DispatcherExists implements Middleware {
  run(message: Message, client: Client): Message {
    if (!client.dispatcher) throw new CommandException(message, commands.DISPATCHER_NOT_FOUND);
    return message;
  }
}
