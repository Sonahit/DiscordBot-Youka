import { Command } from "src/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/core/BaseCommand";
import { Client } from "src/core/Client";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { Middleware } from "src/contracts/Middleware";

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
