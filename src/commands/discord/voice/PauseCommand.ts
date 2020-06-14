import { Command } from "src/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/core/BaseCommand";
import { Client } from "src/core/Client";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { Middleware } from "src/contracts/Middleware";
import { ResponseEmoji } from "src/core/enums/ResponseEmoji";
import { DispatcherExists } from "src/middlewares/DispatcherExists";

export default class PauseCommand extends BaseCommand implements Command {
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
    return "";
  }
}
