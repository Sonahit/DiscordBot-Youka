import Validator from "src/utils/Validator";
import {
  Message,
  Client,
  VoiceConnection,
  User,
  MessageEmbed,
  Channel,
  VoiceChannel,
  GuildMember,
  GuildChannel,
  GuildChannelStore
} from "discord.js";

declare global {
  namespace NodeJS {
    interface Global {
      validator: Validator;
    }
  }
}

declare module "yooka-bot" {
  export type YUser = {
    username: string;
    discriminator: string;
    id: string;
  };

  export type Radio = {
    name: string;
    URL: string;
    jenre: string;
  };

  export interface HandlersCollection {
    [name: string]: any;
  }

  export interface HandlersConfig {
    [name: string]: string[];
  }

  export interface RemindUser {
    time: number;
    user: {
      id: string;
      name: string;
    };
  }

  export interface Config {
    token: string;
    prefix: string;
    google: {
      youtubeApiKey: string;
      cridentials: {
        projectId: number;
        path: string;
      };
    };
    twitch: {
      api: string;
      client_id: string;
      client_secret: string;
    };
    whitelist: Array<YUser>;
    blacklist: Array<YUser>;
    commands: HandlersConfig;
    radioList: Array<Radio>;
  }
}

export interface VoiceHandler {
  join(msg: Message): void;
  leave(msg: Message): void;
  play(msg: Message): void;
  radio(msg: Message): void;
  pause(msg: Message): void;
  resume(msg: Message): void;
  stop(msg: Message, client: Client, mode: string): void;
  skip(msg: Message, clinet: Client): void;
  volume(msg: Message): void;
  queue(msg: Message): void;
  rerun(msg: Message): void;
  playlist(msg: Message): void;
  ["playlist play"](msg: Message): void;
  startMusic(connection: VoiceConnection, msg: Message): void;
  finish(connection: VoiceConnection, reason: string, msg: Message): void;
}

export interface ValidationHandler {
  isWhiteListed(author: User): boolean;
  isBlackListed(author: User): boolean;
  addToBlackList(msg: Message): any;
  addToWhiteList(msg: Message): any;
  hasPermission(msg: Message, roles: string[]): boolean;
  roleWithoutEmoji(role: string): string;
  validateURL(url: string): boolean;
  checkBotMove(command: string): boolean;
  greetMessage(msg: string): boolean;
  checkMoveUser(msg: string): boolean;
}

export interface RepliesHandler {
  Greet(msg: Message, client: Client): void;
  onHello(msg: Message): void;
  author(msg: Message): void;
  ping(msg: Message): void;
  help(msg: Message): void;
  AYAYA(msg: Message): void;
  getPermission(msg: Message): string;
  getHelpMessage(embed: MessageEmbed, permission: string): MessageEmbed;
  DJHelp(embed: MessageEmbed): void;
  AdminHelp(embod: MessageEmbed): void;
  time(msg: Message): void;
  getDay(): string | undefined;
  getMonth(): string | undefined;
}

export interface MovingHandler {
  moveTo(msg: Message): void;
  follow(msg: Message, client: Client): void;
  ["follow user"](msg: Message, client: Client, user: GuildMember): void;
  ["follow me"](msg: Message): void;
  ["follow stop"](msg: Message): void;
  getRooms(channels: GuildChannelStore): Array<any>;
  getChannel(id: number, msg: Message): GuildChannel | undefined;
}

export interface AdminCommandsHandler {
  IAdmin(msg: Message): void;
  IUser(msg: Message): void;
  kick(msg: Message): void;
  start(author: User): void;
  restart(msg: Message, client: Client): void;
  disconnect(msg: Message, client: Client): void;
  whitelist(msg: Message): void;
  remove_whitelist(msg: Message): void;
  remove_blacklist(msg: Message): void;
  show_whitelist(msg: Message): void;
}

export interface StreamsHandler {
  stream(msg: Message): void;
  current(msg: Message): void;
  remind(msg: Message): void;
  getStreamerInfo(
    streamName: string,
    embed: MessageEmbed
  ): Promise<{
    embed: MessageEmbed;
    isOnline: boolean;
  }>;
  getApiUrl(host: string, path: string, options: any): string;
}
