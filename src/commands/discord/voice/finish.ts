import { Command } from "@core/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { Middleware } from "@core/contracts/Middleware";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { ResponseEmoji } from "@core/enums/ResponseEmoji";
import { DispatcherExists } from "src/middlewares/DispatcherExists";
import { VoiceConnectionExists } from "src/middlewares/VoiceConnectionExists";
import config from "@utils/config";

export default class FinishCommand extends BaseCommand  {
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
    return `${config("config.prefix")}${this.commandName()}`;
  }
}
