import { Command } from "@core/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { Middleware } from "@core/contracts/Middleware";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { DispatcherExists } from "src/middlewares/DispatcherExists";
import { ResponseEmoji } from "@core/enums/ResponseEmoji";
import config from "@utils/config";

export default class StopCommand extends BaseCommand {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckDjPermissions());
    this.middlewares.push(new DispatcherExists());
  }
  run(args: string[], message: Message, client: Client) {
    client.dispatcher = undefined;
    client.connection?.disconnect();
    client.musicQueue.clean();
  }
  afterRun(args: string[], message: Message, client: Client) {
    message.react(ResponseEmoji.OK);
  }
  description(): string {
    return "stop playing song";
  }
  commandName(): string {
    return "stop";
  }

  example(): string {
    return `${config("config.prefix")}${this.commandName()}`;
  }
}
