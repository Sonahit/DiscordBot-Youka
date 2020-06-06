import { Command } from "src/Contracts/Command";
import { Middleware } from "src/Contracts/Middleware";
import { Message } from "discord.js";
import BaseCommand from "src/Core/BaseCommand";
import { Client } from "src/Core/Client";

export default class AboutCommand extends BaseCommand implements Command {
  middlewares?: Middleware[] | undefined;
  run(args: string[], message: Message, client: Client) {
    //
  }
  description(): string {
    return "Information about mentioned user";
  }
  commandName(): string {
    return "about";
  }
  example(): string {
    return "";
  }
}
