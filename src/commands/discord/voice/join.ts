import { Command } from "@core/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { Middleware } from "@core/contracts/Middleware";
import { ResponseEmoji } from "@core/enums/ResponseEmoji";
import { CheckVoiceChannel } from "src/middlewares/CheckVoiceChannel";
import config from "@utils/config";
import trans from "@utils/trans";

export default class JoinCommand extends BaseCommand  {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckDjPermissions());
    this.middlewares.push(new CheckVoiceChannel());
  }
  async run(args: string[], message: Message, client: Client) {
    if (message.client.voice) {
      return message.channel.send(trans('errors.in_voice'));
    }
    const user = message.member;
    const channel = user!.voice!.channel!;
    client.connection = await channel.join();
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
    return `${config("config.prefix")}${this.commandName()}`;
  }
}
