import { Command } from "src/Contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/Core/BaseCommand";
import { Client } from "src/Core/Client";
import { CheckDjPermissions } from "src/Middlewares/CheckDjPermissions";
import { Middleware } from "src/Contracts/Middleware";

export default class PlaylistCommand extends BaseCommand implements Command {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckDjPermissions());
  }

  beforeRun(args: string[], message: Message, client: Client) {}
  run(args: string[], message: Message, client: Client) {
    return true;
  }
  description(): string {
    return "show playlist of an :url";
  }
  commandName(): string {
    return "playlist";
  }

  example(): string {
    return "";
  }
}
