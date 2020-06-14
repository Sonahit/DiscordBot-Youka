import { Middleware } from "@core/contracts/Middleware";
import { Message } from "discord.js";
import { Client } from "@core/Client";
import { CommandException } from "@core/exceptions/CommandException";
import commands from "src/lang/ru/commands";

export class DispatcherNotExists implements Middleware {
  run(message: Message, client: Client): Message {
    if (client.dispatcher) throw new CommandException(message, commands.DISPATCHER_FOUND_ERROR);
    return message;
  }
}
