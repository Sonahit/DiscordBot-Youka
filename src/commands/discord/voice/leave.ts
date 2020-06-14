import { Command } from "@core/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { Middleware } from "@core/contracts/Middleware";
import { VoiceConnectionExists } from "src/middlewares/VoiceConnectionExists";
import { ResponseEmoji } from "@core/enums/ResponseEmoji";
import config from "@utils/config";

export default class LeaveCommand extends BaseCommand  {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckDjPermissions());
    this.middlewares.push(new VoiceConnectionExists());
  }
  run(args: string[], message: Message, client: Client) {
    client.connection?.disconnect();
  }
  afterRun(args: string[], message: Message, client: Client) {
    message.react(ResponseEmoji.OK);
  }
  description(): string {
    return "leave voice channel";
  }
  commandName(): string {
    return "leave";
  }

  example(): string {
    return `${config("config.prefix")}${this.commandName()}`;
  }
}
