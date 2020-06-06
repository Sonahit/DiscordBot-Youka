import { Command } from "src/Contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/Core/BaseCommand";
import { Client } from "src/Core/Client";
import { CheckDjPermissions } from "src/Middlewares/CheckDjPermissions";
import { Middleware } from "src/Contracts/Middleware";
import { DispatcherExists } from "src/Middlewares/DispatcherExists";

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
