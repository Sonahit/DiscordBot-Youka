import { Command } from "src/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/core/BaseCommand";
import { Client } from "src/core/Client";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { Middleware } from "src/contracts/Middleware";
import { ResponseEmoji } from "src/core/enums/ResponseEmoji";
import { CheckVoiceChannel } from "src/middlewares/CheckVoiceChannel";

export default class JoinCommand extends BaseCommand implements Command {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckDjPermissions());
    this.middlewares.push(new CheckVoiceChannel());
  }
  run(args: string[], message: Message, client: Client) {
    if (!message.client.voice) {
      message.channel.send("");
    }
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
