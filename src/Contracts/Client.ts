import { Client as BaseClient, Message, VoiceConnection, StreamDispatcher } from "discord.js";
import { Config } from "yooka-bot";
import { Queueable } from "./Queueable";
import { Music } from "src/Types/Music";

export interface Client extends BaseClient {
  config: Config;
  musicQueue: Queueable<Music>;
  connection?: VoiceConnection;
  dispatcher?: StreamDispatcher;

  getToken(): string;
  setToken(token: string): void;
  getPrefix(): string;
  setPrefix(token: string): void;
  handleMessage(message: Message): void;
}
