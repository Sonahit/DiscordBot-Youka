import { Message } from "discord.js";
import { Client } from "src/core/Client";

export interface Middleware {
  run(message: Message, client: Client): Message;
}
