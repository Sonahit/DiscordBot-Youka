import { Command } from "@core/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { Middleware } from "@core/contracts/Middleware";
import { ResponseEmoji } from "@core/enums/ResponseEmoji";
import { DispatcherExists } from "src/middlewares/DispatcherExists";
import config from "@utils/config";

export default class PauseCommand extends BaseCommand {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckDjPermissions());
    this.middlewares.push(new DispatcherExists());
  }
  run(args: string[], message: Message, client: Client) {
    client.dispatcher?.pause();
    message.react(ResponseEmoji.OK);
  }
  description(): string {
    return "pause current song";
  }
  commandName(): string {
    return "pause";
  }

  example(): string {
    return `${config("config.prefix")}${this.commandName()}`;
  }
}
