import { Registrant } from "src/Contracts/Registrant";
import { CommandRegistrant } from "./CommandRegistrant";
import { Client } from "./Client";
import { Config } from "yooka-bot";
import { Command } from "src/Contracts/Command";

export class App {
  private static instance: App;

  registrants: Registrant[] = [];
  commandRegistrant: CommandRegistrant;
  client: Client;
  nodeProcess!: NodeJS.Process;

  constructor(config: Config) {
    this.commandRegistrant = new CommandRegistrant();
    this.client = new Client(config);
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

  start() {
    this.client.login().then(() => {
      logger.info(`Initialized ${this.client.user?.username}`);
      this.client.on("message", this.client.handleMessage);
    });
  }
}
