import { Command } from "@core/contracts/Command";
import { Client } from "@core/Client";
import { Message } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import config from "@utils/config";

export default class StreamsCommand extends BaseCommand {
  run(args: string[], message: Message, client: Client) {
    return true;
  }

  description(): string {
    return "show twitch stream at :name";
  }

  commandName(): string {
    return "twitch-streams";
  }

  example(): string {
    return `${config("config.prefix")}${this.commandName()} sodapoppin`;
  }
}
