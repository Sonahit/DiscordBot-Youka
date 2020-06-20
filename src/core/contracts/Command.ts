import { Message } from "discord.js";
import { Middleware } from "./Middleware";
import { Client } from "./Client";

export interface Command {
  middlewares?: Middleware[];

  run(args: string[], message: Message, client: Client): void | Promise<void>;
  description(): string;
  commandName(): string;
  example(): string;
  beforeRun(args: string[], message: Message, client: Client): void | Promise<void>;
  afterRun(args: string[], message: Message, client: Client): void | Promise<void>;
}
