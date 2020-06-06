import { Middleware } from "src/Contracts/Middleware";
import { Message } from "discord.js";
import { Client } from "src/Core/Client";

export class TrimStringMiddleware implements Middleware {
  run(message: Message, client: Client): Message {
    message.content = message.content.trim();
    return message;
  }
}
