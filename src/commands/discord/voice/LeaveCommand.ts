import { Command } from "src/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/core/BaseCommand";
import { Client } from "src/core/Client";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { Middleware } from "src/contracts/Middleware";
import { VoiceConnectionExists } from "src/middlewares/VoiceConnectionExists";
import { ResponseEmoji } from "src/core/enums/ResponseEmoji";

export default class LeaveCommand extends BaseCommand implements Command {
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
    return "";
  }
}
