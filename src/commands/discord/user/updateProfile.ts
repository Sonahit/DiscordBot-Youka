import { Command } from "@core/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { Middleware } from "@core/contracts/Middleware";
import config from "@utils/config";

export default class AboutCommand extends BaseCommand  {
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
    return `${config("config.prefix")}${this.commandName()}`;
  }
}
