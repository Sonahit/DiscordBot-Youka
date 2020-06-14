import { Command } from "src/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "src/core/BaseCommand";
import { Client } from "src/core/Client";
import { CheckDjPermissions } from "src/middlewares/CheckDjPermissions";
import { CheckUrl } from "src/middlewares/CheckUrl";
import { Middleware } from "src/contracts/Middleware";
import ytd from "ytdl-core";
import { Music } from "src/types/Music";
import { CheckVoiceChannel } from "src/middlewares/CheckVoiceChannel";
import { CommandException } from "src/exceptions/CommandException";
import { ErrorHandler } from "src/core/ErrorHandler";
import commands from "src/lang/ru/commands";

export default class PlayCommand extends BaseCommand implements Command {
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
    if (!songInfo) throw new CommandException(message, commands.VIDEO_NOT_FOUND.replace(":video", url));
    const music: Music = {
      id: songInfo.video_id,
      url: songInfo.video_url,
      videoInfo: songInfo,
    };
    const embed = client.musicQueue.getEmbed(music);
    if (client.musicQueue.empty()) {
      client.musicQueue.push(music);
      const user = message.member;
      const channel = user!.voice!.channel!;
      client.connection = await channel.join();
      const dispatcher = client!.connection!.play(
        ytd(music.url, {
          filter: "audioonly",
        }),
        {
          volume: 0.05,
        }
      );
      client.dispatcher = dispatcher;
      if (client.dispatcher) {
        client.dispatcher.once("finish", this.finishSong.bind(this, message, client));
        embed.setDescription(`Starting song ${music.videoInfo.player_response.videoDetails.title}`);
        message.channel.send(embed);
      }
    } else {
      client.musicQueue.push(music);
      embed.setDescription(`Added to queue! Queue number ${client.musicQueue.size()}`);
      message.channel.send(embed);
    }
  }

  playSongQueue(message: Message, client: Client) {
    client.musicQueue.pop();
    const song = client.musicQueue.lastItem();
    if (song) {
      client.dispatcher = client.connection?.play(
        ytd(song.url, {
          filter: "audioonly",
        }),
        {
          volume: 0.05,
        }
      );
      if (client.dispatcher) client.dispatcher.once("finish", this.finishSong.bind(this, message, client));
    } else {
      client.dispatcher = undefined;
      client.connection?.disconnect();
      logger.info(`Finished playing songs`);
    }
  }

  finishSong(message: Message, client: Client) {
    if (!client.musicQueue.empty()) {
      this.playSongQueue(message, client);
    }
  }

  description(): string {
    return "play song on :url";
  }

  commandName(): string {
    return "play";
  }

  example(): string {
    return "";
  }
}
