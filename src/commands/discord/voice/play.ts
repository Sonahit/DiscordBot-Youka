
import { Message } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { CheckUrl } from "src/middlewares/CheckUrl";
import { Middleware } from "@core/contracts/Middleware";
import ytd from "ytdl-core";
import { Music } from "@core/types/Music";
import { CheckVoiceChannel } from "src/middlewares/CheckVoiceChannel";
import { CommandException } from "@core/exceptions/CommandException";
import { ErrorHandler } from "@core/ErrorHandler";
import trans from "@utils/trans";
import config from "@utils/config";
import VoiceHelper from "@core/helpers/VoiceHelper";

export default class PlayCommand extends BaseCommand  {
  middlewares: Middleware[] = [];

  constructor() {
    super();
    this.middlewares.push(new CheckDjPermissions());
    this.middlewares.push(new CheckUrl());
    this.middlewares.push(new CheckVoiceChannel());
  }

  async run(args: string[], message: Message, client: Client) {
    const url = args[0];
    const songInfo = await ytd
      .getInfo(url, {
        filter: "audioonly",
      })
      .catch((err) => {
        ErrorHandler.handle(message, new CommandException(message, err));
      });
    if (!songInfo) {
      throw new CommandException(message, trans("commands.VIDEO_NOT_FOUND", { video: url }));
    }
    const music: Music = {
      id: songInfo.video_id,
      url: songInfo.video_url,
      videoInfo: songInfo,
    };
    return await VoiceHelper.playSong(music, message, client);
  }

  description(): string {
    return "play song on :url";
  }

  commandName(): string {
    return "play";
  }

  example(): string {
    return `${config("config.prefix")}${this.commandName()}`;
  }
}
