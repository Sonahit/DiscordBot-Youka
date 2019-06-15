const ytdlVideo = require("ytdl-core");
const Discord = require("discord.js");
const validation = global.Validation;
const config = validation.config;
const http = require("http");
const {
  awaitRadioChoose,
  awaitEmbedReply
} = require("../../utils/EmbedReplies");
const {
  isListURL,
  parseIntoId,
  getYoutubePlayList,
  showVideoData,
  isPlayingMusic
} = require("./Utils");
const TTS = require("./TTS");
const { google } = require("googleapis");
const youtubeApi = google.youtube({
  version: "v3",
  auth: config.Google.youtubeApiKey
});

//#TODO refactor
class Voice {
  constructor() {
    this._data = {
      dispatcher: false,
      videoData: "",
      queue: [],
      playing: false,
      onAir: false,
      skippedSong: ""
    };
    this.streamOptions = { volume: 0.03, passes: 3 };
  }

  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;
  }

  join(msg) {
    const embed = new Discord.MessageEmbed();
    if (msg.member != null) {
      if (msg.member.voice.channel) {
        msg.member.voice.channel.join();
      } else {
        embed
          .setColor("0xff0000")
          .setDescription("You need to join a voice channel first!");
        msg.reply(embed);
      }
    } else {
      const current = msg.author;
      embed
        .setColor("0xff0000")
        .setDescription(`Stop typying me in pm :angry: `);
      current.send(embed);
    }
  }

  leave(msg) {
    try {
      msg.member.voice.channel.leave();
    } catch (err) {
      console.log(err);
    }
    this.data.playing = false;
    this.data.queue = [];
    this.data.onAir = false;
  }

  async play(msg) {
    const embed = new Discord.MessageEmbed();
    if (!msg.member && this.data.onAir) {
      embed.setColor("0x004444").setDescription(`Radio is on air!`);
      msg.channel.send(embed);
      return;
    }
    const url = msg.content.split(" ")[1];
    if (this.data.playing || this.data.queue > 0) {
      this.data.queue.push(url);
      const videoData = await ytdlVideo.getInfo(url).catch(err => {
        console.log(err);
      });
      showVideoData(msg, videoData, "queue");
      return;
    }
    if (msg.member.voice.channel) {
      this.data.playing = true;
      this.data.queue.push(url);
      msg.member.voice.channel
        .join()
        .then(async connection => {
          this.data.videoData = await ytdlVideo.getInfo(url).catch(err => {
            console.log(err);
          });
          this.startMusic(connection, msg);
        })
        .catch(console.error);
    } else {
      embed
        .setColor("0xff0000")
        .setDescription("You need to join a voice channel first!");
      msg.reply(embed);
    }
  }

  radio(msg) {
    if (!msg.member) {
      return;
    }
    const embed = new Discord.MessageEmbed();
    if (
      msg.member.voice.channel &&
      !isPlayingMusic(this.data.onAir, this.data.playing)
    ) {
      msg.member.voice.channel
        .join()
        .then(async connection => {
          http.get(await awaitRadioChoose(msg, msg.author, embed), res => {
            this.data.onAir = true;
            this.data.dispatcher = connection.play(res, this.streamOptions);
          });
        })
        .catch(console.error);
    } else {
      if (!msg.member.voice.channel) {
        embed
          .setColor("0xff0000")
          .setDescription("You need to join a voice channel first!");
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

  pause(msg) {
    if (msg.member.voice.channel && this.data.dispatcher != false) {
      this.data.dispatcher.pause();
    }
  }

  resume(msg) {
    if (msg.member.voice.channel && this.data.dispatcher != false) {
      this.data.dispatcher.resume();
    }
  }

  stop(msg, client, mode = "force") {
    if (msg.content === `${config.prefix}stop` || this.data.dispatcher) {
      if (msg.member.voice.channel) {
        if (this.data.playing) {
          if (mode === "force") {
            this.data.dispatcher.emit("end", "force");
            this.data.playing = false;
            msg.reply(`Stopped playing songs`);
            return;
          }
          if (mode === "skip") {
            this.data.dispatcher.emit("end", "skip");
            msg.reply(`Skipped song`);
            return;
          }
        }
        if (this.data.onAir) {
          this.data.onAir = false;
          msg.reply(`Shutting down radio...`);
          http.globalAgent.destroy();
          return;
        }
        this.data.dispatcher.emit("end", "force");
      }
    } else {
      msg.reply(`I am not playing any song or radio`);
    }
  }

  skip(msg, client) {
    this.stop(msg, client, "skip");
  }

  volume(msg) {
    if (msg.member.voice.channel && this.data.dispatcher != false) {
      let volume = msg.content.substring(
        config.prefix.length + "volume".length,
        msg.content.length
      );
      if (volume <= 200) {
        this.data.dispatcher.setVolume(parseFloat(volume / 1000));
        this.streamOptions.volume = parseFloat(volume / 1000);
      } else {
        msg.reply(`You exited available range of sound try to use 0 - 200`);
      }
    }
  }

  async queue(msg) {
    const embed = new Discord.MessageEmbed();
    if (this.data.playing) {
      await awaitEmbedReply(msg, this.data, embed);
    } else {
      msg.reply(`No queue`);
    }
  }

  rerun(msg) {
    if (this.data.skippedSong != false) {
      this.data.queue.unshift(this.data.skippedSong);
      this.data.queue.unshift(this.data.skippedSong);
      this.data.dispatcher.emit("end", "rerun");
    } else {
      msg.reply(`You didn't skip any song`);
    }
  }

  async playList(msg) {
    if (msg.content.includes(`${config.prefix}playList play`)) {
      this["playList play"](msg);
      return;
    }
    const playListURL = msg.content.substring(
      config.prefix.length + "playList".length + 1,
      msg.content.length
    );
    const playlistId = isListURL(playListURL)
      ? parseIntoId(playListURL)
      : playListURL;
    const embed = new Discord.MessageEmbed();
    embed.setColor("0x004444");
    const options = {
      part: "snippet",
      playlistId: playlistId
    };
    const videos = await getYoutubePlayList(options);
    const promises = [];
    videos.forEach(video => {
      promises.push(
        ytdlVideo
          .getInfo(video.snippet.resourceId.videoId)
          .then(info => {
            const durationMin = Math.floor(info.length_seconds / 60);
            const durationSec = Math.ceil(info.length_seconds % 60);
            embed.addField(
              `Author: ${info.author.name}`,
              `Duration: ${durationMin} mins : ${durationSec} seconds. \n Title: [${
                info.title
              }](${info.video_url})`
            );
          })
          .catch(err => {
            console.log(err);
          })
      );
    });
    msg.reply("Collecting videos... Please wait!");
    embed.setDescription(`Play list requested by ${msg.author.username}`);
    await Promise.all(promises).then(() => {
      msg.reply(embed);
    });
  }

  TTS(msg) {
    TTS.speak(msg, this.data);
  }

  async "playList play"(msg) {
    const playListURL = msg.content.substring(
      config.prefix.length + "playList play".length + 1,
      msg.content.length
    );
    const playlistId = isListURL(playListURL)
      ? parseIntoId(playListURL)
      : playListURL;
    const embed = new Discord.MessageEmbed();
    const options = {
      part: "snippet",
      playlistId: playlistId
    };
    const videos = await getYoutubePlayList(options, youtubeApi);
    embed.setColor("0x004444");
    embed.setDescription(
      `Added to queue.\nRequested by ${msg.author.username}`
    );
    msg.reply("Collecting videos... Please wait!");
    if (msg.member.voice.channel) {
      videos.forEach(async video => {
        const url = `https://www.youtube.com/watch?v=${
          video.snippet.resourceId.videoId
        }`;
        this.data.queue.push(url);
        if (!this.data.playing) {
          this.data.playing = true;
          msg.member.voice.channel
            .join()
            .then(async connection => {
              this.data.videoData = await ytdlVideo.getInfo(url).catch(err => {
                console.log(err);
              });
              this.startMusic(connection, msg);
            })
            .catch(console.error);
        }
      });
    } else {
      embed
        .setColor("0xff0000")
        .setDescription("You need to join a voice channel first!");
      msg.reply(embed);
      throw new Error(`${msg.author.username} hasn't joined voice channel`);
    }
  }
  async startMusic(connection, msg) {
    this.data.videoData = await ytdlVideo.getInfo(this.data.queue[0]);
    showVideoData(msg, this.data.videoData, "play");
    try {
      this.data.dispatcher = await connection.play(
        await ytdlVideo(this.data.queue[0]),
        this.streamOptions
      );
      console.log("STARTED PLAYING SONG");
    } catch (err) {
      msg.reply("WRONG URL");
    }
    this.data.dispatcher.on("end", reason => {
      reason = reason || "end";
      console.log(`FINISHED PLAYING A SONG BECAUSE ${reason}`);
      this.finish(connection, reason, msg);
    });
  }

  finish(connection, reason, msg) {
    this.data.skippedSong = this.data.queue.shift();
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

module.exports = Voice;
