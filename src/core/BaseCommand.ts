import { Command as Contract } from "src/contracts/Command";
import { Client } from "./Client";
import { Message } from "discord.js";
import { Middleware } from "src/contracts/Middleware";
import { ResponseEmoji } from "./enums/ResponseEmoji";

export default class BaseCommand implements Contract {
  constructor() {}
  middlewares?: Middleware[] | undefined;
  run(args: string[], message: Message, client: Client): void {
    throw new Error("Method not implemented.");
  }
  description(): string {
    throw new Error("Method not implemented.");
  }
  commandName(): string {
    throw new Error("Method not implemented.");
  }
  beforeRun(args: string[], message: Message, client: Client): void {}
  afterRun(args: string[], message: Message, client: Client): void {
    message.react(ResponseEmoji.OK);
  }

  example(): string {
    return "";
  }
}
