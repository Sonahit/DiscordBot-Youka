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
    return "Update user's profile description";
  }

  commandName(): string {
    return "update-user";
  }
  example(): string {
    return "";
  }
}
