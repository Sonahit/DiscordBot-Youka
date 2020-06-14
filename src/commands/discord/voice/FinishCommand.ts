import { Command } from "src/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/core/BaseCommand";
import { Client } from "src/core/Client";
import { Middleware } from "src/contracts/Middleware";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { ResponseEmoji } from "src/core/enums/ResponseEmoji";
import { DispatcherExists } from "src/middlewares/DispatcherExists";
import { VoiceConnectionExists } from "src/middlewares/VoiceConnectionExists";

export default class FinishCommand extends BaseCommand implements Command {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckDjPermissions());
    this.middlewares.push(new DispatcherExists());
    this.middlewares.push(new VoiceConnectionExists());
  }

  run(args: string[], message: Message, client: Client) {
    client.dispatcher?.emit("finish");
  }

  description(): string {
    return "Finish song";
  }

  afterRun(args: string[], message: Message, client: Client) {
    message.react(ResponseEmoji.OK);
  }

  commandName(): string {
    return "finish";
  }

  example(): string {
    return "";
  }
}
