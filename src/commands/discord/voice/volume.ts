import { Command } from "@core/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { Middleware } from "@core/contracts/Middleware";
import { CommandException } from "@core/exceptions/CommandException";
import { ResponseEmoji } from "@core/enums/ResponseEmoji";
import trans from "@utils/trans";
import config from "@utils/config";

export default class VolumeCommand extends BaseCommand {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckDjPermissions());
  }

  run(args: string[], message: Message, client: Client) {
    if (!client.dispatcher)
      throw new CommandException(
        message,
        trans("commands.DISPATCHER_NOT_FOUND")
      );
    const volume = parseInt(args[0]);
    if (volume <= 250 && volume >= 0) {
      client.dispatcher.setVolume(volume / 1000);
    } else {
      throw new CommandException(message, trans("commands.VOICE_OUT_OF_RANGE"));
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
    return `${config("config.prefix")}${this.commandName()} 100`;
  }
}
