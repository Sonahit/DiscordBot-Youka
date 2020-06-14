import { Middleware } from "@core/contracts/Middleware";
import { Message } from "discord.js";
import { Client } from "@core/Client";

export class CheckUrl implements Middleware {
  run(message: Message, client: Client): Message {
    return message;
  }
}
