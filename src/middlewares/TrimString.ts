import { Middleware } from "src/contracts/Middleware";
import { Message } from "discord.js";
import { Client } from "src/core/Client";

export class TrimStringMiddleware implements Middleware {
  run(message: Message, client: Client): Message {
    message.content = message.content.trim();
    return message;
  }
}
