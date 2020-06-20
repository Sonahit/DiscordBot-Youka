import { Client as Contract } from "./contracts/Client";
import { Client as BaseClient, Message, ClientOptions, VoiceConnection, StreamDispatcher } from "discord.js";
import { Config } from "yooka-bot";
import { App } from "./App";
import { CommandException } from "@core/exceptions/CommandException";
import { Middleware } from "@core/contracts/Middleware";
import { ErrorHandler } from "./ErrorHandler";
import { MusicQueue } from "@core/queues/MusicQueue";
import config from "@core/utils/config";
import trans from "@utils/trans";
import { OutgoingHttpHeaders } from "http2";
import { Agent as Http } from "http";
import { Agent as Https } from "https";

export class Client extends BaseClient implements Contract {
  config: Config;
  voiceOptions = {
    volume: 0.05,
  }
  headers: OutgoingHttpHeaders = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    pragma: 'no-cache',
    'accept-language': 'en-US,en;q=0.9,ru-RU;q=0.8,ru;q=0.7',
    accept: '*/*',
    'accept-encoding': 'gzip, deflate, br'
  }
  agent: Http | Https | null = null;
  musicQueue: MusicQueue;
  connection?: VoiceConnection;
  dispatcher?: StreamDispatcher;

  constructor(config: Config, options: ClientOptions | undefined = undefined) {
    super(options);
    this.config = config;
    this.musicQueue = new MusicQueue();
  }

  getToken(): string {
    return this.config.token;
  }

  setToken(token: string): void {
    this.config.token = token;
  }

  getPrefix(): string {
    return this.config.prefix;
  }

  setPrefix(prefix: string): void {
    this.config.prefix = prefix;
  }

  runAgainstMiddlewares(message: Message, middlewares: Middleware[] | null = null): Message {
    if (middlewares) {
      middlewares.forEach((middleware) => {
        const newMessage = middleware.run(message, this);
        message = newMessage;
      });
    }
    return message;
  }

  async handleMessage(message: Message): Promise<void> {
    try {
      if (!message.content.startsWith(this.getPrefix())) return;
      if (message.author.bot) return;
      message = this.runAgainstMiddlewares(message, config("app.middlewares"));
      const { command, args } = App.getInstance().getCommandHandler(message.content);
      if (typeof command === "boolean") {
        throw new CommandException(
          message,
          trans("commands.not_found", {
            command: message.content.substr(this.getPrefix().length),
          })
        );
      }
      logger.info(`Handling ${command.commandName()}`);
      message = this.runAgainstMiddlewares(message, command.middlewares);
      await command.beforeRun(args, message, this);
      await command.run(args, message, this);
      await command.afterRun(args, message, this);
    } catch (e) {
      ErrorHandler.handle(message, e);
    }
  }

  login(token?: string) {
    if (token) {
      return super.login(token);
    }
    return super.login(this.config.token);
  }
}
