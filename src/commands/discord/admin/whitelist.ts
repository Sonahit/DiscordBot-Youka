import { Command } from "@core/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { Middleware } from "@core/contracts/Middleware";
import { CheckModeratorPermissions } from "src/middlewares/CheckModeratorPermissions";
import config from "@utils/config";

export default class WhitelistCommand extends BaseCommand {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckModeratorPermissions());
  }

  run(args: string[], message: Message, client: Client) {
    return true;
  }
  description(): string {
    return "whitelist user";
  }
  commandName(): string {
    return "whitelist";
  }
  example(): string {
    return `${config("config.prefix")}${this.commandName()} @Me`;
  }
}
