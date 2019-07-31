const ytdlVideo = require("ytdl-core");
const Discord = require("discord.js");
const https = require("https");
const http = require("http");
const validation = global.Validation;
const config = validation.config;
const VoiceHelpers = require("./VoiceHelpers");
const TTS = require("./TTS");
const { google } = require("googleapis");
const youtubeApi = google.youtube({
  version: "v3",
  auth: config.Google.youtubeApiKey
});

class Voice {
  constructor() {
    this._data = {
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

  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;
  }

  join(msg) {
    const embed = new Discord.MessageEmbed();
    if (msg.member != null) {
      //Is user on channel?
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
      console.error(err);
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
      const currentSong = await ytdlVideo.getInfo(url).catch(err => {
        console.error(err);
      });
      VoiceHelpers.showCurrentSong(msg, currentSong, "queue");
      return;
    }
    //Is user on channel?
    if (msg.member.voice.channel) {
      this.data.playing = true;
      this.data.queue.push(url);
      msg.member.voice.channel
        .join()
        .then(async connection => {
          this.data.currentSong = await ytdlVideo.getInfo(url).catch(err => {
            console.error(err);
          });
          this.startMusic(connection, msg);
        })
        .catch(err => {
          console.error(err);
        });
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
      !VoiceHelpers.isPlayingMusic(this.data.onAir, this.data.playing)
    ) {
      msg.member.voice.channel
        .join()
        .then(async connection => {
          const url = await VoiceHelpers.awaitRadioChoose(
            msg,
            msg.author,
            embed
          );
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
      //Is user on channel?
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
          https.globalAgent.destroy();
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
      try {
        let volume = new Number(
          msg.content.substring(
            config.prefix.length + "volume".length,
            msg.content.length
          )
        );
        if (volume <= 200) {
          this.data.dispatcher.setVolume(parseFloat(volume / 1000));
          this.streamOptions.volume = parseFloat(volume / 1000);
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

  queue(msg) {
    if (this.data.playing) {
      VoiceHelpers.showQueue(msg, this.data.queue);
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

  async playlist(msg) {
    if (msg.content.includes(`${config.prefix}playlist play`)) {
      this["playlist play"](msg);
      return;
    }
    const playlistURL = msg.content.substring(
      config.prefix.length + "playlist".length + 1,
      msg.content.length
    );
    const playlistId = VoiceHelpers.isListURL(playlistURL)
      ? VoiceHelpers.parseIntoId(playlistURL)
      : playlistURL;
    const embed = new Discord.MessageEmbed();
    embed.setColor("0x004444");
    const options = {
      part: "snippet",
      playlistId: playlistId
    };
    const videos = await VoiceHelpers.getYoutubePlaylist(
      options,
      youtubeApi
    ).then(videos => {
      videos.forEach((video, index, videos) => {
        videos[index] = video.snippet.resourceId.videoId;
      });
      return videos;
    });
    VoiceHelpers.showQueue(msg, videos);
  }

  TTS(msg) {
    TTS.speak(msg, this.data);
  }

  async "playlist play"(msg) {
    const playlistURL = msg.content.substring(
      config.prefix.length + "playlist play".length + 1,
      msg.content.length
    );
    const playlistId = VoiceHelpers.isListURL(playlistURL)
      ? VoiceHelpers.parseIntoId(playlistURL)
      : playlistURL;
    const embed = new Discord.MessageEmbed();
    const options = {
      part: "snippet",
      playlistId: playlistId
    };
    const videos = await VoiceHelpers.getYoutubeplaylist(options, youtubeApi);
    embed.setColor("0x004444");
    embed.setDescription(
      `Added to queue.\nRequested by ${msg.author.username}`
    );
    //Is user on channel?
    if (msg.member.voice.channel) {
      msg.reply("Collecting videos... Please wait!");
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
              this.data.currentSong = await ytdlVideo
                .getInfo(url)
                .catch(err => {
                  console.error(err);
                });
              this.startMusic(connection, msg);
            })
            .catch(err => console.error(err));
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
    this.data.currentSong = await ytdlVideo.getInfo(this.data.queue[0]);
    VoiceHelpers.showCurrentSong(msg, this.data.currentSong, "play");
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
