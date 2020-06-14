import { Message } from "discord.js";
import { Client } from "@core/Client";

export interface Middleware {
  run(message: Message, client: Client): Message;
}
