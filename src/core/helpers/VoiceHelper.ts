import { Client } from "@core/Client";
import { Message, StreamDispatcher } from "discord.js";
import ytd from "ytdl-core";
import { Music } from "@core/types/Music";
import http, { IncomingMessage, OutgoingHttpHeaders } from "http";
import https from 'https';
import { promisify } from "util";
import { URL } from "url";
import { CommandException } from "@core/exceptions/CommandException";
import trans from "@utils/trans";

export default class VoiceHelper {

  static async playSong(music: Music, message: Message, client: Client) {
    const embed = client.musicQueue.getEmbed(music);
    if (client.musicQueue.empty()) {
      client.musicQueue.push(music);
      const user = message.member;
      const channel = user!.voice!.channel!;
      client.connection = await channel.join();
      client.dispatcher = client!.connection!.play(
        ytd(music.url, {
          filter: "audioonly",
        }),
        client.voiceOptions
      );
      client.dispatcher.once("finish", VoiceHelper.finishSong.bind(this, message, client));
      embed.setDescription(`Starting song ${music.videoInfo.player_response.videoDetails.title}`);
    } else {
      client.musicQueue.push(music);
      embed.setDescription(`Added to queue! Queue number ${client.musicQueue.size()}`);
    }
    return message.channel.send(embed);
  }

  static async playHttp(res: IncomingMessage, message: Message, client: Client, followRedirect: boolean = true): Promise<StreamDispatcher> {
    const redirectTo = followRedirect ? VoiceHelper.resolveRedirect(res) : "";
    const statusCode = res.statusCode || 0;
    if(statusCode >= 300 && statusCode <= 400 && redirectTo) {
      try{
        const url = new URL(redirectTo as string);
        const headers: OutgoingHttpHeaders = client.headers;
        if (res.headers['set-cookie']) {
          headers['cookies'] = res.headers['set-cookie'];
        }
        const options: http.RequestOptions = {
          agent: client.agent as any,
          host: url.host,
          path: url.pathname,
          protocol: 'http',
          headers,
        };
        const newRes: any = await promisify(http.get)(options as any);
        return VoiceHelper.playHttp(newRes, message, client, followRedirect);
      } catch (e) {
        if(e instanceof IncomingMessage) {
          return VoiceHelper.playHttp(e, message, client, followRedirect);
        }
        throw new CommandException(message, trans('server.system_fault'));
      }
    }
    return client.connection!.play(res, client.voiceOptions);
  }

  static resolveRedirect(res: IncomingMessage): string {
    let redirectTo = "";
    const location = res.headers['location'];
    if(location) redirectTo = location;
    return redirectTo ? new URL(redirectTo).href : redirectTo;
  }


  static async playHttps(res: IncomingMessage, message: Message, client: Client, followRedirect: boolean = true): Promise<StreamDispatcher> {
    const redirectTo = followRedirect ? VoiceHelper.resolveRedirect(res) : "";
    const statusCode = res.statusCode || 0;
    if(statusCode >= 300 && statusCode <= 400 && redirectTo) {
      try{
        const url = new URL(redirectTo as string);
        const headers: OutgoingHttpHeaders = client.headers;
        if (res.headers['set-cookie']) {
          headers['cookies'] = res.headers['set-cookie'];
        }
        const options: https.RequestOptions = {
          agent: client.agent as any,
          host: url.host,
          path: url.pathname,
          headers,
        };
        const newRes: any = await promisify(https.get)(options as any);
        return VoiceHelper.playHttps(newRes, message, client, followRedirect);
      } catch (e) {
        if(e instanceof IncomingMessage) {
          return VoiceHelper.playHttps(e, message, client, followRedirect);
        }
        throw new CommandException(message, trans('system.server_fault'));
      }
    }
    return client.connection!.play(res, client.voiceOptions);
  }

  static playSongQueue(message: Message, client: Client) {
    client.musicQueue.pop();
    const song = client.musicQueue.lastItem();
    if (song) {
      client.dispatcher = client.connection?.play(
        ytd(song.url, {
          filter: "audioonly",
        }),
        client.voiceOptions
      );
      if (client.dispatcher) client.dispatcher.once("finish", VoiceHelper.finishSong.bind(this, message, client));
    } else {
      client.dispatcher = undefined;
      client.connection?.disconnect();
      logger.info(`Finished playing songs`);
    }
  }

  static finishSong(message: Message, client: Client) {
    if (!client.musicQueue.empty()) {
      VoiceHelper.playSongQueue(message, client);
    } else {
      client.dispatcher = undefined;
      client.agent?.destroy();
      client.connection?.disconnect();
    }
  }

  static handleErrors(data: any) {
    logger.error(data);
  }
}
