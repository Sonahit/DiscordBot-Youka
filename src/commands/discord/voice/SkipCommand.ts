import { Command } from "src/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/core/BaseCommand";
import { Client } from "src/core/Client";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { Middleware } from "src/contracts/Middleware";
import { ResponseEmoji } from "src/core/enums/ResponseEmoji";
import { DispatcherExists } from "src/middlewares/DispatcherExists";

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
