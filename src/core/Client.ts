import { Client as Contract } from "../contracts/Client";
import { Client as BaseClient, Message, ClientOptions, VoiceConnection, StreamDispatcher } from "discord.js";
import { Config } from "yooka-bot";
import { App } from "./App";
import { CommandException } from "src/exceptions/CommandException";
import { Middleware } from "src/contracts/Middleware";
import { ErrorHandler } from "./ErrorHandler";
import { MusicQueue } from "src/queues/MusicQueue";
import config from "src/utils/config";

export class Client extends BaseClient implements Contract {
  config: Config;
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

  handleMessage(message: Message): void {
    try {
      if (!message.content.startsWith(this.getPrefix())) return;
      if (message.author.bot) return;
      message = this.runAgainstMiddlewares(message, config("app.middlewares"));
      const { command, args } = App.getInstance().getCommandHandler(message.content);
      if (typeof command === "boolean") {
        throw new CommandException(message, `Command '**${message.content.substr(this.getPrefix().length)}**' does not exist`);
      }
      logger.info(`Handling ${command.commandName()}`);
      message = this.runAgainstMiddlewares(message, command.middlewares);
      command.beforeRun(args, message, this);
      command.run(args, message, this);
      command.afterRun(args, message, this);
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
