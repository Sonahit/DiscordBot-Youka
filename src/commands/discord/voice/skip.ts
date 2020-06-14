import { Command } from "@core/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { Middleware } from "@core/contracts/Middleware";
import { ResponseEmoji } from "@core/enums/ResponseEmoji";
import { DispatcherExists } from "src/middlewares/DispatcherExists";
import config from "@utils/config";

export default class SkipCommand extends BaseCommand {
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
    return `${config("config.prefix")}${this.commandName()}`;
  }
}
