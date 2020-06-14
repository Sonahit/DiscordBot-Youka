import { Command } from "src/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/core/BaseCommand";
import { Client } from "src/core/Client";
import { Middleware } from "src/contracts/Middleware";

export default class AboutCommand extends BaseCommand implements Command {
  middlewares?: Middleware[] | undefined;
  run(args: string[], message: Message, client: Client) {
    //
  }

  description(): string {
    return "Update user's profile description";
  }

  commandName(): string {
    return "update-user";
  }
  example(): string {
    return "";
  }
}
