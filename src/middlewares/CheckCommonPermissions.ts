import { Middleware } from "src/contracts/Middleware";
import { Message } from "discord.js";
import { Client } from "src/core/Client";

export class CheckCommonPermissions implements Middleware {
  run(message: Message, client: Client): Message {
    return message;
  }
}
