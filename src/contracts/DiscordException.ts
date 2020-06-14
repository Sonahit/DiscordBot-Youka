import { Message } from "discord.js";

export interface DiscordException {
  clientMessage: Message;

  getClientMessage(): Message;
}
