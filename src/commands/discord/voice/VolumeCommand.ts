import { Command } from "src/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/core/BaseCommand";
import { Client } from "src/core/Client";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { Middleware } from "src/contracts/Middleware";
import commands from "src/lang/ru/commands";
import { CommandException } from "src/exceptions/CommandException";
import { ResponseEmoji } from "src/core/enums/ResponseEmoji";

export default class VolumeCommand extends BaseCommand implements Command {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckDjPermissions());
  }

  run(args: string[], message: Message, client: Client) {
    if (!client.dispatcher) throw new CommandException(message, commands.DISPATCHER_NOT_FOUND);
    const volume = parseInt(args[0]);
    if (volume <= 250 && volume >= 0) {
      client.dispatcher.setVolume(volume / 1000);
    } else {
      throw new CommandException(message, commands.VOICE_OUT_OF_RANGE);
    }
  }

  afterRun(args: string[], message: Message, client: Client) {
    message.react(ResponseEmoji.OK);
  }

  description(): string {
    return "change playing volume";
  }

  commandName(): string {
    return "volume";
  }

  example(): string {
    return "";
  }
}
