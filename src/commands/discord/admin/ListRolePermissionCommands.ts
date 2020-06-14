import { Command } from "src/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/core/BaseCommand";
import { Client } from "src/core/Client";
import { Middleware } from "src/contracts/Middleware";
import { CheckModeratorPermissions } from "src/middlewares/CheckModeratorPermissions";

export default class ListRolePermissionCommand extends BaseCommand implements Command {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckModeratorPermissions());
  }

  run(args: string[], message: Message, client: Client) {
    return true;
  }
  description(): string {
    return "Show list of roles and theirs permissions";
  }
  commandName(): string {
    return "list-permission";
  }
  example(): string {
    return "";
  }
}
