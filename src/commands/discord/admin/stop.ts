import { Command } from "@core/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { Middleware } from "@core/contracts/Middleware";
import { CheckModeratorPermissions } from "src/middlewares/CheckModeratorPermissions";
import { App } from "@core/App";
import config from "@utils/config";

export default class StopCommand extends BaseCommand  {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckModeratorPermissions());
  }

  run(args: string[], message: Message, client: Client) {
    const app = App.getInstance();
    app.stop();
  }
  description(): string {
    return "Stop bot";
  }
  commandName(): string {
    return "bot-stop";
  }
  example(): string {
    return `${config("config.prefix")}${this.commandName()}`;
  }
}
