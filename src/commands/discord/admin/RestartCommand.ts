import { Command } from "src/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/core/BaseCommand";
import { Client } from "src/core/Client";
import { Middleware } from "src/contracts/Middleware";
import { CheckModeratorPermissions } from "src/middlewares/CheckModeratorPermissions";
import { App } from "src/core/App";

export default class RestartCommand extends BaseCommand implements Command {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckModeratorPermissions());
  }

  run(args: string[], message: Message, client: Client) {
    const app = App.getInstance();
    app.restart();
  }
  description(): string {
    return "Restart bot";
  }
  commandName(): string {
    return "bot-restart";
  }
  example(): string {
    return "";
  }
}
