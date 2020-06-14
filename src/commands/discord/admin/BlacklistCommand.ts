import { Command } from "src/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/core/BaseCommand";
import { Client } from "src/core/Client";
import { Middleware } from "src/contracts/Middleware";
import { CheckModeratorPermissions } from "src/middlewares/CheckModeratorPermissions";

export default class BlacklistCommand extends BaseCommand implements Command {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckModeratorPermissions());
  }

  run(args: string[], message: Message, client: Client) {
    return true;
  }
  description(): string {
    return "Add mentioned user to blacklist";
  }
  commandName(): string {
    return "blacklist";
  }
  example(): string {
    return "";
  }
}
