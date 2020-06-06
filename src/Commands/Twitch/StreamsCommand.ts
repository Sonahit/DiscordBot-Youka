import { Command } from "src/Contracts/Command";
import { Client } from "src/Core/Client";
import { Message } from "discord.js";
import BaseCommand from "src/Core/BaseCommand";

export default class StreamsCommand extends BaseCommand implements Command {
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
    return "";
  }
}
