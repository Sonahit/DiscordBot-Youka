import { Command } from "src/Contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/Core/BaseCommand";
import { Client } from "src/Core/Client";
import { CheckModeratorPermissions } from "src/Middlewares/CheckModeratorPermissions";
import { Middleware } from "src/Contracts/Middleware";
import { App } from "src/Core/App";

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
