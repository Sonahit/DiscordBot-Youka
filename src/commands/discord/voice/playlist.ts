import { Command } from "@core/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { Middleware } from "@core/contracts/Middleware";
import config from "@utils/config";

export default class PlaylistCommand extends BaseCommand {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckDjPermissions());
  }

  beforeRun(args: string[], message: Message, client: Client) {}

  run(args: string[], message: Message, client: Client) {
    return true;
  }

  description(): string {
    return "show playlist of an :url";
  }

  commandName(): string {
    return "playlist";
  }

  example(): string {
    return `${config(
      "config.prefix"
    )}${this.commandName()} https://www.youtube.com/watch?v=Tgn-5aDtpl0&list=PLpeT3TZU-3DQzVS5agXAeP5QInz6O2xUQ`;
  }
}
