import { Client, Message } from "discord.js";
import logger from "winston";
import { HandlersCollection, Config, HandlersConfig, IPermissions } from "yooka-bot";
import RolesPermissions from "./Interactions/Discord/RolesPermissions";
import Validator from "./utils/Validator";
import Voice from "./Interactions/Discord/Voice/Voice";
import Moving from "./Interactions/Discord/Moving";
import Streams from "./Interactions/Twitch/Streams";
import AdminCommands from "./Interactions/Discord/Admin/AdminCommands";
import Replies from "./Interactions/Discord/Replies";

import "opusscript";

// Configure logger settings
global.logger = logger
  .remove(logger.transports.Console)
  .add(new logger.transports.Console())
  .add(
    new logger.transports.File({
      dirname: "./storage/logs",
      filename: `[${new Date().getMonth()}M__${new Date().getDay()}D__${new Date().getHours()}H] winston_log_${new Date().getDay()}D.log`
    })
  );
global.logger.level = "info";

// Initialize Discord Bot
class Bot {
  _handlers: HandlersCollection;
  _commands: HandlersConfig;
  validator: Validator;
  client: Client;
  permissions: RolesPermissions;
  config: Config;

  constructor(client: Client, config: Config, permissionsPath: string) {
    this.client = client;
    this._handlers = {};
    this._commands = config.commands;
    this.config = config;
    this.validator = new Validator();
    this.permissions = new RolesPermissions(permissionsPath);
  }

  get handlers(): HandlersCollection {
    return this._handlers;
  }

  setHandler(name: string, handler: any) {
    this._handlers[name] = handler;
  }

  getHandlerByCommand(command: string) {
    for (const key in this.handlers) {
      const commands: string[] = this._commands[key];
      if (commands.some(v => v === command)) return this.handlers[key];
    }
    return false;
  }

  getHandlerByName(name: string) {
    for (const key in this.handlers) {
      const handler = this.handlers[key];
      if (handler.constructor.name === name) return handler;
    }
    return false;
  }

  initBot(client: Client): Bot {
    this.login(client)
      .then(() => {
        this.handleMessage();
      })
      .catch(err => {
        logger.error(err.message);
      });
    return this;
  }

  initHandlers(): Bot {
    const handlers = [new Voice(), new AdminCommands(), new Moving(), new Replies(), new Streams(), this.permissions];
    handlers.forEach(handler => {
      const name = handler.constructor.name;
      this.setHandler(name, handler);
    });
    return this;
  }

  initOnExit() {
    process.on("beforeExit", () => {
      this.disconnect();
    });
    return this;
  }

  login(client: Client): Promise<string> {
    client.on("ready", () => {
      logger.info("Connected");
      logger.info(`Logged in as: ${client.user!.username} ${client.user!.id}`);
      logger.info(`Connected via ${client.user!.username}`);
      client.user!.setPresence({
        activity: { name: "With pleasure", type: "PLAYING" },
        status: "online"
      });
    });
    client.on("error", error => {
      logger.error(error.message);
    });
    return client.login(this.config.token);
  }

  disconnect() {
    this.client.destroy();
  }

  handleCommand(command: string, msg: Message): void {
    const handler = this.getHandlerByCommand(command);
    if (handler) {
      const name = handler.constructor.name;
      const permission = this.permissions.whatPermissions(name);
      if (this.validator.hasPermission(msg, permission)) {
        handler[command](msg, this.client);
        logger.info(`${msg.author.username} executed ${name} ---> ${command}`);
      }
    } else {
      logger.info(`${command} doesn't exist`);
    }
  }

  handleMessage(): void {
    this.client.on("message", (msg: Message) => {
      try {
        logger.info(`"${msg.content}" sent by ${msg.author.username} at ${Date.now()}`);
        if (this.validator.isBlackListed(msg.author) && msg.content === "AYAYA" && msg.author.bot === false) {
          const replies = this.getHandlerByName("Replies") as Replies;
          replies.AYAYA(msg);
        }
        if (msg.content.startsWith(this.config.prefix) && msg.author.bot === false) {
          //Checking for common permissions
          if (this.validator.hasPermission(msg, global.permissions.common)) {
            const keyWord = msg.content
              .split(`${this.config.prefix}`)[1]
              .trim()
              .split(" ")[0];
            this.handleCommand(keyWord, msg);
          } else {
            const replies = this.getHandlerByName("Replies") as Replies;
            replies.Error(msg);
          }
        }
      } catch (err) {
        logger.error(err);
      }
    });
  }
}

export default Bot;
