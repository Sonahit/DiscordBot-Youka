import { Command } from "src/Contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/Core/BaseCommand";
import { Client } from "src/Core/Client";
import { Middleware } from "src/Contracts/Middleware";
import { CheckDjPermissions } from "src/Middlewares/CheckDjPermissions";
import { DispatcherExists } from "src/Middlewares/DispatcherExists";
import { ResponseEmoji } from "src/Core/Enums/ResponseEmoji";

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
