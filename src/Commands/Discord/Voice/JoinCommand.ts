import { Command } from "src/Contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/Core/BaseCommand";
import { Client } from "src/Core/Client";
import { CheckDjPermissions } from "src/Middlewares/CheckDjPermissions";
import { Middleware } from "src/Contracts/Middleware";
import { ResponseEmoji } from "src/Core/Enums/ResponseEmoji";
import { CheckVoiceChannel } from "src/Middlewares/CheckVoiceChannel";

export default class JoinCommand extends BaseCommand implements Command {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckDjPermissions());
    this.middlewares.push(new CheckVoiceChannel());
  }
  run(args: string[], message: Message, client: Client) {
    message.client.voice;
  }
  description(): string {
    return "join to voice channel";
  }
  afterRun(args: string[], message: Message, client: Client) {
    message.react(ResponseEmoji.OK);
  }
  commandName(): string {
    return "join";
  }

  example(): string {
    return "";
  }
}
