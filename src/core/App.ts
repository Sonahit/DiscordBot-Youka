import { Registrant } from "@core/contracts/Registrant";
import { CommandRegistrant } from "./CommandRegistrant";
import { Client } from "./Client";
import { Config } from "yooka-bot";
import { Command } from "@core/contracts/Command";
import trans from "@core/utils/trans";
import Redis from "./storage/Redis";

export class App {
  private static instance: App;

  public registrants: Registrant[] = [];
  public commandRegistrant: CommandRegistrant;
  public client: Client;
  public nodeProcess!: NodeJS.Process;
  public redisConnection: Redis;

  constructor(config: Config) {
    this.commandRegistrant = new CommandRegistrant();
    this.client = new Client(config);
    this.redisConnection = new Redis({
      host: this.client.config.redisHost,
      port: this.client.config.redisPort,
      password: this.client.config.redisPassword,
    });

    App.instance = this;
  }

  static getInstance() {
    return App.instance;
  }

  static setInstance(instance: App) {
    App.instance = instance;
  }

  getCommandHandler(
    content: string
  ): {
    command: Command | boolean;
    args: string[];
  } {
    const commandRegistrant = App.getInstance().commandRegistrant;
    const commandWithArgs = content.substr(this.client.config.prefix.length).split(" ");
    const command = commandWithArgs[0];
    const args = commandWithArgs.filter((_, i) => i !== 0);
    return {
      command: commandRegistrant.find(command),
      args,
    };
  }

  restart() {
    if (this.client) {
      this.stop();
    }
    this.start();
  }

  stop() {
    const config = this.client.config;
    this.client.destroy();
    this.client = new Client(config);
  }

  async start() {
    await this.client.login();
    logger.info(trans("bot.start", { bot: this.client.user?.username || "Bot" }));
    this.client.on("message", this.client.handleMessage);
  }
}
