import ytdlVideo, { videoInfo } from "ytdl-core";
import Discord, { Message, Client, VoiceConnection, StreamDispatcher } from "discord.js";
import https from "https";
import http from "http";
import config from "../../../../config/config";
import * as Matcher from "./helpers/Matcher";
import * as Queuer from "./helpers/Queuer";
import { google, youtube_v3 } from "googleapis";
import { VoiceHandler } from "typings";
const youtubeApi = google.youtube({
  version: "v3",
  auth: config.google.youtubeApiKey
});

interface VoiceData {
  dispatcher: boolean | Discord.StreamDispatcher;
  currentSong: string | ytdlVideo.videoInfo;
  queue: Array<string>;
  playing: boolean;
  onAir: boolean;
  skippedSong: string;
}

interface StreamOptions {
  volume: number;
  passes: number;
}

class Voice implements VoiceHandler {
  data: VoiceData;
  streamOptions: StreamOptions;
  constructor() {
    this.data = {
      dispatcher: false,
      currentSong: "",
      queue: [],
      playing: false,
      onAir: false,
      //If skip song contain it here
      skippedSong: ""
    };
    this.streamOptions = { volume: 0.05, passes: 3 };
  }

  join(msg: Message) {
    const embed = new Discord.MessageEmbed();
    if (msg.member != null) {
      //Is user on channel?
      if (msg.member.voice.channel) {
        msg.member.voice.channel.join();
      } else {
        embed.setColor("0xff0000").setDescription("You need to join a voice channel first!");
        msg.reply(embed);
      }
    } else {
      const current = msg.author;
      embed.setColor("0xff0000").setDescription(`Stop typying me in pm :angry: `);
      current.send(embed);
    }
  }

  leave(msg: Message) {
    try {
      msg.member!.voice.channel!.leave();
    } catch (err) {
      logger.error(err);
    }
    this.playVoice(false);
    this.data.queue = [];
  }

  async play(msg: Message) {
    const embed = new Discord.MessageEmbed();
    if (!msg.member && this.data.onAir) {
      embed.setColor("0x004444").setDescription(`Radio is on air!`);
      return msg.channel.send(embed);
    }
    const url = new URL(msg.content.split(" ")[1]);
    if (this.data.playing || this.data.queue.length > 0) {
      this.data.queue.push(url.href);
      const currentSong = await ytdlVideo.getInfo(url.href).catch(err => {
        logger.error(err);
      });
      return Queuer.showCurrentSong(msg, currentSong as videoInfo, "queue");
    }
    //Is user not on channel?
    if (!msg.member!.voice.channel) {
      embed.setColor("0xff0000").setDescription("You need to join a voice channel first!");
      return msg.reply(embed);
    }
    this.data.queue.push(url.href);
    msg
      .member!.voice.channel.join()
      .then(async connection => {
        this.data.currentSong = (await ytdlVideo.getInfo(url.href).catch(err => {
          logger.error(err);
        })) as ytdlVideo.videoInfo;
        this.startMusic(connection, msg);
      })
      .catch(err => {
        logger.error(err);
      });
  }

  radio(msg: Message) {
    if (!msg.member) return;
    const embed = new Discord.MessageEmbed();
    if (msg.member.voice.channel && !Matcher.isPlayingMusic(this.data.onAir, this.data.playing)) {
      msg.member.voice.channel
        .join()
        .then(async connection => {
          const url = await Queuer.awaitRadioChoose(msg, msg.author);
          try {
            https.get(url, res => {
              this.playVoice(connection.play(res, this.streamOptions), false, true);
            });
          } catch (err) {
            http.get(url, res => {
              this.playVoice(connection.play(res, this.streamOptions), false, true);
            });
          }
        })
        .catch(err => logger.error(err.message));
    } else {
      if (!msg.member.voice.channel) {
        embed.setColor("0xff0000").setDescription("You need to join a voice channel first!");
      } else if (this.data.onAir) {
        embed.setColor("0x004444").setDescription(`Radio is on air!`);
      } else if (this.data.playing) {
        embed.setColor("0x004444").setDescription(`I am playing a song!`);
      }
      msg.channel.send(embed);
    }
  }

  private playVoice(connection: StreamDispatcher | boolean, playing: boolean = false, onAir: boolean = false) {
    if (connection === false && typeof this.data.dispatcher !== "boolean") {
      this.data.dispatcher.emit("finish");
    } else {
      this.data.dispatcher = connection;
    }
    this.data.playing = playing;
    this.data.onAir = onAir;
  }

  pause(msg: Message) {
    if (msg.member!.voice.channel && typeof this.data.dispatcher !== "boolean") {
      this.data.dispatcher.pause();
    }
  }

  resume(msg: Message) {
    if (msg.member!.voice.channel && typeof this.data.dispatcher !== "boolean") {
      this.data.dispatcher.resume();
    }
  }

  stop(msg: Message, client: Client, mode = "force") {
    //Is user on channel?
    if (!msg.member!.voice.channel || typeof this.data.dispatcher === "boolean") return;
    if (this.data.playing) {
      if (mode === "force") {
        msg.reply(`Stopped playing songs`);
        this.playVoice(false);
      }
      if (mode === "skip") {
        msg.reply(`Skipped song`);
      }
      this.data.dispatcher.emit("finish", mode);
      return;
    }
    if (this.data.onAir) {
      this.data.dispatcher.emit("finish", "force");
      msg.reply(`Shutting down radio...`);
      https.globalAgent.destroy();
      http.globalAgent.destroy();
      this.playVoice(false);
      return;
    }
  }

  skip(msg: Message, client: Client) {
    this.stop(msg, client, "skip");
  }

  volume(msg: Message) {
    if (msg.member!.voice.channel) {
      if (typeof this.data.dispatcher === "boolean") return msg.reply("Play video");
      try {
        const regex = new RegExp(`${config.prefix}volume\\s+`, "gi");
        const content = msg.content.split(regex);
        const volume = parseInt(content[1]);
        if (isNaN(volume)) throw new Error("Wrong Number");
        if (volume > 200) return msg.reply(`You exited available range of sound try to use 0 - 200`);
        this.data.dispatcher.setVolume(volume / 1000);
        this.streamOptions.volume = volume / 1000;
      } catch (err) {
        msg.reply(err.message);
      }
    } else {
      msg.reply("Join voice");
    }
  }

  queue(msg: Message) {
    if (!this.data.playing) return msg.reply(`No queue`);
    Queuer.showQueue(msg, this.data.queue);
  }
  /*

(node:20896) UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'player_response' of undefined
    at Object.showCurrentSong (C:\Users\Ivan\git\Bot\src\Interactions\Discord\Voice\helpers\Queuer.ts:11:44)
    at Voice.<anonymous> (C:\Users\Ivan\git\Bot\src\Interactions\Discord\Voice\Voice.ts:84:21)
    at Generator.next (<anonymous>)
*/
  rerun(msg: Message) {
    if (typeof this.data.dispatcher === "boolean") return msg.reply(`You didn't skip any song`);
    this.data.queue.unshift(this.data.skippedSong);
    this.data.queue.unshift(this.data.skippedSong);
    this.data.dispatcher.emit("finish", "rerun");
  }

  async playlist(msg: Message) {
    if (msg.content.includes(`${config.prefix}playlist play`)) return this["playlist play"](msg);
    const content = msg.content;
    const playlistURL = new URL(content.split(`${config.prefix}playlist`)[1].trim());
    const playlistId = playlistURL.searchParams.get("list");
    const embed = new Discord.MessageEmbed();
    embed.setColor("0x004444");
    const options = {
      part: "snippet",
      playlistId: playlistId
    };
    const videos = await Queuer.getYoutubePlaylist(options, youtubeApi).then(videos => {
      if (!videos) return [];
      return videos.map((video: any) => video.snippet.resourceId.videoId) as Array<number>;
    });
    Queuer.showQueue(msg, videos);
  }

  async "playlist play"(msg: Message) {
    const embed = new Discord.MessageEmbed();
    if (!msg.member!.voice.channel) {
      embed.setColor("0xff0000").setDescription("You need to join a voice channel first!");
      msg.reply(embed);
      throw new Error(`${msg.author.username} hasn't joined voice channel`);
    }
    const playlistURL = msg.content.substring(config.prefix.length + "playlist play".length + 1, msg.content.length);
    const playlistId = Matcher.isListURL(playlistURL) ? Matcher.parseIntoId(playlistURL) : playlistURL;
    const options = {
      part: "snippet",
      playlistId: playlistId
    };
    const videos = (await Queuer.getYoutubePlaylist(options, youtubeApi)) as youtube_v3.Schema$PlaylistItem[];
    embed.setColor("0x004444");
    embed.setDescription(`Added to queue.\nRequested by ${msg.author.username}`);
    //Is user on channel?
    msg.reply("Collecting videos... Please wait!");
    this.data.queue = videos.map(video => {
      const url = new URL(`watch?v=${video.snippet!.resourceId!.videoId}`, "https://www.youtube.com/");
      return url.href;
    });
    const connection = await msg.member!.voice.channel!.join();
    this.startMusic(connection, msg);
  }
  async startMusic(connection: VoiceConnection, msg: Message) {
    this.data.currentSong = await ytdlVideo.getInfo(this.data.queue[0]);
    Queuer.showCurrentSong(msg, this.data.currentSong, "play");
    const start = parseInt(new URL(this.data.queue[0]).searchParams.get("t") || "0");
    try {
      this.playVoice(connection.play(ytdlVideo(this.data.queue[0], { filter: "audioonly", range: { start } }), this.streamOptions), true, false);
      logger.info("STARTED PLAYING SONG");
    } catch (err) {
      msg.reply("WRONG URL");
    }
    if (typeof this.data.dispatcher === "boolean") return;
    this.data.dispatcher.on("finish", (reason: string) => {
      reason = reason || "end";
      logger.info(`FINISHED PLAYING A SONG BECAUSE ${reason}`);
      this.finish(connection, reason, msg);
    });
  }

  finish(connection: VoiceConnection, reason: string, msg: Message) {
    this.data.skippedSong = this.data.queue.shift() as string;
    if (reason === "rerun") {
      this.data.skippedSong = "";
    }
    if (reason === "force" || this.data.queue.length === 0) {
      this.data.playing = false;
      if (reason === "force") {
        this.data.queue = [];
        this.data.dispatcher = false;
      }
      msg.channel.send(`End of queue`);
      connection.disconnect();
    } else {
      this.startMusic(connection, msg);
    }
  }
}

export default Voice;
