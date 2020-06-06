import { Command } from "src/Contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/Core/BaseCommand";
import { Client } from "src/Core/Client";
import { Middleware } from "src/Contracts/Middleware";
import { CheckDjPermissions } from "src/Middlewares/CheckDjPermissions";
import { ResponseEmoji } from "src/Core/Enums/ResponseEmoji";
import { DispatcherExists } from "src/Middlewares/DispatcherExists";
import { VoiceConnectionExists } from "src/Middlewares/VoiceConnectionExists";

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
