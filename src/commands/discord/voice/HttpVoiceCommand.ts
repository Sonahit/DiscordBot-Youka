import { Command } from "src/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/core/BaseCommand";
import { Client } from "src/core/Client";
import { Middleware } from "src/contracts/Middleware";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { CheckVoiceChannel } from "src/middlewares/CheckVoiceChannel";
import { DispatcherNotExists } from "src/middlewares/DispatcherNotExists";

export default class HttpVoiceCommand extends BaseCommand implements Command {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckDjPermissions());
    this.middlewares.push(new CheckVoiceChannel());
    this.middlewares.push(new DispatcherNotExists());
  }
  run(args: string[], message: Message, client: Client) {
    return true;
  }
  description(): string {
    return "Translate sounds from url";
  }
  commandName(): string {
    return "urlvoice";
  }
  example(): string {
    return "";
  }
}
