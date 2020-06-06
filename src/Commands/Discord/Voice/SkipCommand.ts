import { Command } from "src/Contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/Core/BaseCommand";
import { Client } from "src/Core/Client";
import { CheckDjPermissions } from "src/Middlewares/CheckDjPermissions";
import { Middleware } from "src/Contracts/Middleware";
import { ResponseEmoji } from "src/Core/Enums/ResponseEmoji";
import { DispatcherExists } from "src/Middlewares/DispatcherExists";

export default class SkipCommand extends BaseCommand implements Command {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckDjPermissions());
    this.middlewares.push(new DispatcherExists());
  }
  run(args: string[], message: Message, client: Client) {
    client.dispatcher!.emit("finish");
  }
  description(): string {
    return "skip song";
  }
  afterRun(args: string[], message: Message, client: Client) {
    message.react(ResponseEmoji.OK);
  }
  commandName(): string {
    return "skip";
  }

  example(): string {
    return "";
  }
}
