import { Message } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { Middleware } from "@core/contracts/Middleware";
import { CheckModeratorPermissions } from "src/middlewares/CheckModeratorPermissions";
import { App } from "@core/App";
import config from "@utils/config";

export default class RestartCommand extends BaseCommand {
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
    return `${config("config.prefix")}${this.commandName()}`;
  }
}
