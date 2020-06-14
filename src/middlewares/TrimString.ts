import { Middleware } from "@core/contracts/Middleware";
import { Message } from "discord.js";
import { Client } from "@core/Client";

export class TrimStringMiddleware implements Middleware {
  run(message: Message, client: Client): Message {
    message.content = message.content.trim();
    return message;
  }
}
