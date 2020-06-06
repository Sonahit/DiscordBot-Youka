import { Message } from "discord.js";
import { Client } from "src/Core/Client";

export interface Middleware {
  run(message: Message, client: Client): Message;
}
