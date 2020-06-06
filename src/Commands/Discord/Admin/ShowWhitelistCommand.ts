import { Command } from "src/Contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/Core/BaseCommand";
import { Client } from "src/Core/Client";
import { CheckModeratorPermissions } from "src/Middlewares/CheckModeratorPermissions";
import { Middleware } from "src/Contracts/Middleware";

export default class ShowWhitelistCommand extends BaseCommand implements Command {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckModeratorPermissions());
  }

  run(args: string[], message: Message, client: Client) {
    return true;
  }
  description(): string {
    return "Show whitelisted users";
  }
  commandName(): string {
    return "show-whitelist";
  }
  example(): string {
    return "";
  }
}
