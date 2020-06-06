import { Command } from "src/Contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/Core/BaseCommand";
import { Client } from "src/Core/Client";
import { Middleware } from "src/Contracts/Middleware";
import { CheckModeratorPermissions } from "src/Middlewares/CheckModeratorPermissions";

export default class RemoveRoleFromPermissionCommand extends BaseCommand implements Command {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckModeratorPermissions());
  }

  run(args: string[], message: Message, client: Client) {
    return true;
  }
  description(): string {
    return "Remove mentioned role from permission list";
  }
  commandName(): string {
    return "remove-permission";
  }
  example(): string {
    return "";
  }
}
