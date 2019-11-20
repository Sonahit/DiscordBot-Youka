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
  dispatcher: boolean | StreamDispatcher;
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
    this.streamOptions = { volume: 0.03, passes: 3 };
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
      console.error(err);
    }
    this.data.playing = false;
    this.data.queue = [];
    this.data.onAir = false;
  }

  async play(msg: Message) {
    const embed = new Discord.MessageEmbed();
    if (!msg.member && this.data.onAir) {
      embed.setColor("0x004444").setDescription(`Radio is on air!`);
      return msg.channel.send(embed);
    }
    const url = msg.content.split(" ")[1];
    if (this.data.playing || this.data.queue.length > 0) {
      this.data.queue.push(url);
      const currentSong = await ytdlVideo.getInfo(url).catch(err => {
        console.error(err);
      });
      return Queuer.showCurrentSong(msg, currentSong as videoInfo, "queue");
    }
    //Is user on channel?
    if (msg.member!.voice.channel) {
      this.data.playing = true;
      this.data.queue.push(url);
      msg
        .member!.voice.channel.join()
        .then(async connection => {
          this.data.currentSong = (await ytdlVideo.getInfo(url).catch(err => {
            console.error(err);
          })) as ytdlVideo.videoInfo;
          this.startMusic(connection, msg);
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      embed.setColor("0xff0000").setDescription("You need to join a voice channel first!");
      msg.reply(embed);
    }
  }

  radio(msg: Message) {
    if (!msg.member) {
      return;
    }
    const embed = new Discord.MessageEmbed();
    if (msg.member.voice.channel && !Matcher.isPlayingMusic(this.data.onAir, this.data.playing)) {
      msg.member.voice.channel
        .join()
        .then(async connection => {
          const url = await Queuer.awaitRadioChoose(msg, msg.author);
          try {
            https.get(url, res => {
              this.data.onAir = true;
              this.data.dispatcher = connection.play(res, this.streamOptions);
            });
          } catch (err) {
            http.get(url, res => {
              this.data.onAir = true;
              this.data.dispatcher = connection.play(res, this.streamOptions);
            });
          }
        })
        .catch(err => console.error(err));
    } else {
      if (!msg.member.voice.channel) {
        embed.setColor("0xff0000").setDescription("You need to join a voice channel first!");
      }
      if (this.data.onAir) {
        embed.setColor("0x004444").setDescription(`Radio is on air!`);
      }
      if (this.data.playing) {
        embed.setColor("0x004444").setDescription(`I am playing a song!`);
      }
      msg.channel.send(embed);
    }
  }

  pause(msg: Message) {
    if (msg.member!.voice.channel && this.data.dispatcher instanceof StreamDispatcher) {
      this.data.dispatcher.pause();
    }
  }

  resume(msg: Message) {
    if (msg.member!.voice.channel && this.data.dispatcher instanceof StreamDispatcher) {
      this.data.dispatcher.resume();
    }
  }

  stop(msg: Message, client: Client, mode = "force") {
    if (msg.content === `${config.prefix}stop`) {
      //Is user on channel?
      if (!msg.member!.voice.channel) return;
      if (!(this.data.dispatcher instanceof StreamDispatcher)) return;
      if (this.data.playing) {
        this.data.dispatcher.emit("end", mode);
        if (mode === "force") {
          this.data.playing = false;
          msg.reply(`Stopped playing songs`);
          return;
        }
        if (mode === "skip") {
          msg.reply(`Skipped song`);
          return;
        }
      }
      if (this.data.onAir) {
        this.data.onAir = false;
        msg.reply(`Shutting down radio...`);
        https.globalAgent.destroy();
        http.globalAgent.destroy();
        return;
      }
      this.data.dispatcher.emit("end", "force");
    } else {
      msg.reply(`I am not playing any song or radio`);
    }
  }

  skip(msg: Message, client: Client) {
    this.stop(msg, client, "skip");
  }

  volume(msg: Message) {
    if (msg.member!.voice.channel && this.data.dispatcher instanceof StreamDispatcher) {
      try {
        let volume = parseInt(msg.content.substring(config.prefix.length + "volume".length, msg.content.length));
        if (volume <= 200) {
          this.data.dispatcher.setVolume(parseFloat((volume / 1000).toString()));
          this.streamOptions.volume = parseFloat((volume / 1000).toString());
        } else {
          msg.reply(`You exited available range of sound try to use 0 - 200`);
        }
      } catch (err) {
        msg.reply("Wrong number");
      }
    } else {
      msg.reply("Join voice");
    }
  }

  queue(msg: Message) {
    if (this.data.playing) {
      Queuer.showQueue(msg, this.data.queue);
    } else {
      msg.reply(`No queue`);
    }
  }

  rerun(msg: Message) {
    if (this.data.dispatcher instanceof StreamDispatcher) {
      this.data.queue.unshift(this.data.skippedSong);
      this.data.queue.unshift(this.data.skippedSong);
      this.data.dispatcher.emit("end", "rerun");
    } else {
      msg.reply(`You didn't skip any song`);
    }
  }

  async playlist(msg: Message) {
    if (msg.content.includes(`${config.prefix}playlist play`)) {
      this["playlist play"](msg);
      return;
    }
    const playlistURL = msg.content.substring(config.prefix.length + "playlist".length + 1, msg.content.length);
    const playlistId = Matcher.isListURL(playlistURL) ? Matcher.parseIntoId(playlistURL) : playlistURL;
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
    const playlistURL = msg.content.substring(config.prefix.length + "playlist play".length + 1, msg.content.length);
    const playlistId = Matcher.isListURL(playlistURL) ? Matcher.parseIntoId(playlistURL) : playlistURL;
    const embed = new Discord.MessageEmbed();
    const options = {
      part: "snippet",
      playlistId: playlistId
    };
    const videos = (await Queuer.getYoutubePlaylist(options, youtubeApi)) as youtube_v3.Schema$PlaylistItem[];
    embed.setColor("0x004444");
    embed.setDescription(`Added to queue.\nRequested by ${msg.author.username}`);
    //Is user on channel?
    if (msg.member!.voice.channel) {
      msg.reply("Collecting videos... Please wait!");
      videos.forEach(async video => {
        const url = `https://www.youtube.com/watch?v=${video.snippet!.resourceId!.videoId}`;
        this.data.queue.push(url);
        if (!this.data.playing) {
          this.data.playing = true;
          msg
            .member!.voice.channel!.join()
            .then(async connection => {
              this.data.currentSong = (await ytdlVideo.getInfo(url).catch(err => {
                console.error(err);
              })) as videoInfo;
              this.startMusic(connection, msg);
            })
            .catch(err => console.error(err));
        }
      });
    } else {
      embed.setColor("0xff0000").setDescription("You need to join a voice channel first!");
      msg.reply(embed);
      throw new Error(`${msg.author.username} hasn't joined voice channel`);
    }
  }
  async startMusic(connection: VoiceConnection, msg: Message) {
    this.data.currentSong = await ytdlVideo.getInfo(this.data.queue[0]);
    Queuer.showCurrentSong(msg, this.data.currentSong, "play");
    try {
      this.data.dispatcher = await connection.play(await ytdlVideo(this.data.queue[0]), this.streamOptions);
      console.log("STARTED PLAYING SONG");
    } catch (err) {
      msg.reply("WRONG URL");
    }
    if (!(this.data.dispatcher instanceof StreamDispatcher)) return;
    this.data.dispatcher.on("end", (reason: string) => {
      reason = reason || "end";
      console.log(`FINISHED PLAYING A SONG BECAUSE ${reason}`);
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
      msg.channel.send(`End of queue`);
      if (reason === "force") {
        this.data.queue = [];
        this.data.dispatcher = false;
      }
      connection.disconnect();
    } else {
      this.startMusic(connection, msg);
    }
  }
}

export default Voice;
