import { Middleware } from "src/Contracts/Middleware";
import { Message } from "discord.js";
import { Client } from "src/Core/Client";

export class CheckDjPermissions implements Middleware {
  run(message: Message, client: Client): Message {
    return message;
  }
}
