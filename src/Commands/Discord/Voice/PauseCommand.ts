import { Command } from "src/Contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/Core/BaseCommand";
import { Client } from "src/Core/Client";
import { CheckDjPermissions } from "src/Middlewares/CheckDjPermissions";
import { Middleware } from "src/Contracts/Middleware";
import { ResponseEmoji } from "src/Core/Enums/ResponseEmoji";
import { DispatcherExists } from "src/Middlewares/DispatcherExists";

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
