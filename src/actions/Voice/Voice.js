const ytdlVideo = require("ytdl-core");
const streamOptions = { volume: 0.03, passes: 3 };
const Discord = require("discord.js");
const validation = new global.Validation();
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
  Play,
  isPlayingMusic
} = require("./Utils");
const { google } = require("googleapis");
const youtubeApi = google.youtube({
  version: "v3",
  auth: config.API_KEY
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
          Play(connection, this.data, msg, streamOptions);
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
            this.data.dispatcher = connection.play(res, streamOptions);
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
          }
          if (mode === "skip") {
            this.data.dispatcher.emit("end", "skip");
            msg.reply(`Skipped song`);
          }
        }
        if (this.data.onAir) {
          this.data.onAir = false;
          msg.reply(`Shutting down radio...`);
          http.globalAgent.destroy();
        }
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
        streamOptions.volume = parseFloat(volume / 1000);
      } else {
        msg.reply(`You exited available range of sound try to use 0 - 200`);
      }
    }
  }

  async queue(msg) {
    const embed = new Discord.MessageEmbed();
    if (this.data.playing === true) {
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
    const Discord = require("discord.js");
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

  async "playList play"(msg) {
    const playListURL = msg.content.substring(
      config.prefix.length + "playList play".length + 1,
      msg.content.length
    );
    const playlistId = isListURL(playListURL)
      ? parseIntoId(playListURL)
      : playListURL;
    const Discord = require("discord.js");
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
              Play(connection, this.data, msg);
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
}

module.exports = Voice;
