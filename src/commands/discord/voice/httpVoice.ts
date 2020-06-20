import { Command } from "@core/contracts/Command";
import { Message, VoiceBroadcast } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { Middleware } from "@core/contracts/Middleware";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { CheckVoiceChannel } from "src/middlewares/CheckVoiceChannel";
import { DispatcherNotExists } from "src/middlewares/DispatcherNotExists";
import config from "@utils/config";
import { CommandException } from "@core/exceptions/CommandException";
import trans from "@utils/trans";
import { URL } from "url";
import VoiceHelper from "@core/helpers/VoiceHelper";
import { promisify } from "util";
import http, { Agent as AgentHttp, IncomingMessage } from "http";
import https, { Agent as AgentHttps } from "https";
import { Readable } from "stream";

export default class HttpVoiceCommand extends BaseCommand  {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares = [
      new CheckDjPermissions(),
      new CheckVoiceChannel(),
      new DispatcherNotExists()
    ];
  }
  async run(args: string[], message: Message, client: Client) {
    const urlArg = args[0];
    if(!urlArg) {
      throw new CommandException(message, trans('commands.no_args', {'args': 'url'}));
    }
    const url = new URL(urlArg);
    const match = url.protocol.match(/https?/g);
    if(!match) {
      throw new CommandException(message, trans('commands.wrong', {args: url.href}));
    }
    const protocol = match[0];
    client.agent?.destroy();
    switch(protocol) {
      case 'http': {
        const agent = new AgentHttp({keepAlive: true, timeout: 5000, keepAliveMsecs: 5000});
        const user = message.member;
        const channel = user!.voice!.channel!;
        http.globalAgent = agent;
        client.connection = await channel.join();
        client.agent = agent;
        try {
          const options: http.RequestOptions = {
            agent,
            host: url.host,
            path: url.pathname,
            headers: client.headers
          };

          const res: any = await promisify(https.get)(options as any);
          if(res !== null) {
            client.dispatcher = await VoiceHelper.playHttp(res, message, client);
            break;
          }
        } catch (e) {
          if(e instanceof IncomingMessage) {
            client.dispatcher = await VoiceHelper.playHttp(e, message, client);
          } else {
            logger.error(e.message);
            throw new CommandException(message, trans('system.server_fault'));
          }
        }
        break;
      }
      case 'https': {
        const agent = new AgentHttps({keepAlive: true, keepAliveMsecs: 5000, timeout: 5000});
        const user = message.member;
        https.globalAgent = agent;
        const channel = user!.voice!.channel!;
        client.agent = agent;
        client.connection = await channel.join();
        try {
          const options: https.RequestOptions = {
            agent,
            host: url.host,
            path: url.pathname,
            headers: client.headers
          };
          const res: any = await promisify(https.get)(options as any);
          if(res !== null) {
            client.dispatcher = await VoiceHelper.playHttps(res, message, client);
            break;
          }
        } catch (e) {
          if(e instanceof IncomingMessage) {
            client.dispatcher = await VoiceHelper.playHttps(e, message, client);
          } else {
            logger.error(e.message);
            throw new CommandException(message, trans('system.server_fault'));
          }
        }
        break;
      }
      default: {
        throw new CommandException(message, trans('commands.not_supported', {'item' : protocol}));
      }
    }
    if(!client.dispatcher) {
      client.dispatcher = undefined;
      client.connection?.disconnect();
      throw new CommandException(message, trans('system.server_fault'));
    }
    client.dispatcher.on("error", VoiceHelper.handleErrors);
    client.dispatcher.setPLP(1);
    client.dispatcher.once("finish", VoiceHelper.finishSong.bind(this, message, client));
  }
  description(): string {
    return "Translate sounds from url";
  }
  commandName(): string {
    return "urlvoice";
  }
  example(): string {
    return `${config("config.prefix")}${this.commandName()} http://example.com`;
  }
}
