import { Command } from "src/Contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/Core/BaseCommand";
import { Client } from "src/Core/Client";
import { CheckDjPermissions } from "src/Middlewares/CheckDjPermissions";
import { Middleware } from "src/Contracts/Middleware";
import { VoiceConnectionExists } from "src/Middlewares/VoiceConnectionExists";
import { ResponseEmoji } from "src/Core/Enums/ResponseEmoji";

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
