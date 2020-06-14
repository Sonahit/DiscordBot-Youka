import { Command } from "src/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/core/BaseCommand";
import { Client } from "src/core/Client";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { Middleware } from "src/contracts/Middleware";
import { DispatcherExists } from "src/middlewares/DispatcherExists";

export default class ResumeCommand extends BaseCommand implements Command {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckDjPermissions());
    this.middlewares.push(new DispatcherExists());
  }
  run(args: string[], message: Message, client: Client) {
    client.dispatcher?.resume();
  }
  description(): string {
    return "resume song when stopped";
  }
  commandName(): string {
    return "resume";
  }

  example(): string {
    return "";
  }
}
