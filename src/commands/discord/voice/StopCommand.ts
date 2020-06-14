import { Command } from "src/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/core/BaseCommand";
import { Client } from "src/core/Client";
import { Middleware } from "src/contracts/Middleware";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { DispatcherExists } from "src/middlewares/DispatcherExists";
import { ResponseEmoji } from "src/core/enums/ResponseEmoji";

export default class StopCommand extends BaseCommand implements Command {
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
    return "";
  }
}
