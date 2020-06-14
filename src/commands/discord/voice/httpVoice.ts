import { Command } from "@core/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { Middleware } from "@core/contracts/Middleware";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { CheckVoiceChannel } from "src/middlewares/CheckVoiceChannel";
import { DispatcherNotExists } from "src/middlewares/DispatcherNotExists";
import config from "@utils/config";

export default class HttpVoiceCommand extends BaseCommand  {
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
    return `${config("config.prefix")}${this.commandName()} http://example.com`;
  }
}
