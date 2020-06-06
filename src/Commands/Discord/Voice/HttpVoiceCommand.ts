import { Command } from "src/Contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/Core/BaseCommand";
import { Client } from "src/Core/Client";
import { CheckDjPermissions } from "src/Middlewares/CheckDjPermissions";
import { Middleware } from "src/Contracts/Middleware";
import { CheckVoiceChannel } from "src/Middlewares/CheckVoiceChannel";
import { DispatcherNotExists } from "src/Middlewares/DispatcherNotExists";

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
