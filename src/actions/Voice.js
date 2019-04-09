const ytdlVideo = require("ytdl-core");
const ytdlDiscord = require("ytdl-core-discord");
const streamOptions = { volume: 0.03, passes: 3 };
const streamOpusOptions = { type: "opus", volume: 0.03, passes: 3 };
const Discord = require("discord.js");
let embed = new Discord.MessageEmbed();
const Validation = require("../Validation");
const validation = new Validation();
const config = validation.config;
const http = require("http");
const { awaitRadioChoose, awaitEmbedReply } = require("../utils/Await");

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

  join(message) {
    if (message.member != null) {
      if (message.member.voice.channel) {
        message.member.voice.channel.join();
      } else {
        embed
          .setColor("0xff0000")
          .setDescription("You need to join a voice channel first!");
        message.reply(embed);
      }
    } else {
      const current = message.author;
      embed
        .setColor("0xff0000")
        .setDescription(`Stop typying me in pm :angry: `);
      current.send(embed);
    }
  }

  leave(message) {
    message.member.voice.channel.leave();
    this.data.streaming = false;
    this.data.playing = false;
    this.data.onAir = false;
  }

  async play(message) {
    if (message.member != null && !this.data.onAir) {
      embed = validation.clearEmbed(embed);
      let url = message.content.split(" ")[1];
      if (this.data.playing || this.data.queue > 0) {
        this.data.queue.push(url);
        let videoData = await ytdlVideo.getInfo(url);
        showVideoData(message, videoData, "queue");
      } else {
        if (message.member.voice.channel) {
          embed = validation.clearEmbed(embed);
          this.data.playing = true;
          this.data.queue.push(url);
          message.member.voice.channel
            .join()
            .then(async connection => {
              this.data.videoData = await ytdlVideo.getInfo(url);
              Play(connection, this.data, message);
            })
            .catch(console.error);
        } else {
          embed
            .setColor("0xff0000")
            .setDescription("You need to join a voice channel first!");
          message.reply(embed);
        }
      }
    } else {
      embed = validation.clearEmbed(embed);
      if (this.data.streaming) {
        embed.setColor("0x004444").setDescription(`I am streaming!`);
      } else if (this.data.onAir) {
        embed.setColor("0x004444").setDescription(`Radio is on air!`);
      } else if (this.data.playing) {
        embed.setColor("0x004444").setDescription(`I am playing a song!`);
      }
      message.channel.send(embed);
    }
  }

  radio(message) {
    if (message.member != null) {
      if (
        message.member.voice.channel &&
        !this.data.onAir &&
        !this.data.playing &&
        !this.data.streaming
      ) {
        embed = validation.clearEmbed(embed);
        message.member.voice.channel
          .join()
          .then(async connection => {
            embed = validation.clearEmbed(embed);
            http.get(
              await awaitRadioChoose(message, message.author, embed),
              res => {
                this.data.onAir = true;
                this.data.dispatcher = connection.play(res, streamOptions);
              }
            );
          })
          .catch(console.error);
      } else {
        embed = validation.clearEmbed(embed);
        if (this.data.streaming) {
          embed.setColor("0x004444").setDescription(`I am streaming!`);
        } else if (this.data.onAir) {
          embed.setColor("0x004444").setDescription(`Radio is on air!`);
        } else if (this.data.playing) {
          embed.setColor("0x004444").setDescription(`I am playing a song!`);
        }
        message.channel.send(embed);
      }
    } else {
      const current = message.author;
      current.send(`Stop typying me in pm :angry: `);
    }
  }

  pause(message) {
    if (message.member.voice.channel && this.data.dispatcher != false) {
      this.data.dispatcher.pause();
    }
  }

  resume(message) {
    if (message.member.voice.channel && this.data.dispatcher != false) {
      this.data.dispatcher.resume();
    }
  }

  async stop(message, client, mode = "force") {
    if (message.content === `${config.prefix}stop` || mode === "skip") {
      if (
        message.member.voice.channel &&
        !this.data.onAir &&
        this.data.playing === true
      ) {
        if (mode === "force") {
          this.data.dispatcher.end("force");
          this.data.dispatcher = false;
          this.data.playing = false;
          message.reply(`Stopped playing songs`);
        } else {
          this.data.dispatcher.end("skip");
          message.reply(`Skipped song`);
        }
      } else if (
        message.member.voice.channel &&
        !this.data.streaming &&
        !this.data.onAir
      ) {
        this.data.dispatcher.end;
        this.data.streaming = false;
        message.reply(`Stopped streaming`);
      } else {
        this.data.onAir = false;
        message.reply(`Shutting down radio...`);
        http.globalAgent.destroy();
      }
    } else {
      message.reply(`I am not playing any song or radio`);
    }
  }

  skip(message, client) {
    this.stop(message, client, "skip");
  }

  volume(message) {
    if (message.member.voice.channel && this.data.dispatcher != false) {
      let volume = message.content.substring(8, message.content.length);
      if (volume <= 200) {
        this.data.dispatcher.setVolume(parseFloat(volume / 1000));
      } else {
        message.reply(`You exited available range of sound try to use 0 - 200`);
      }
    }
  }

  async queue(message) {
    embed = validation.clearEmbed(embed);
    if (this.data.playing === true) {
      await awaitEmbedReply(message, this.data, embed);
    } else {
      message.reply(`No queue`);
    }
  }

  rerun(message) {
    embed = validation.clearEmbed(embed);
    if (this.data.skippedSong != null && this.data.skippedSong != false) {
      this.data.queue.unshift(this.data.skippedSong);
      this.data.queue.unshift(this.data.skippedSong);
      this.data.dispatcher.end("rerun");
    } else {
      message.reply(`You didn't skip any song`);
    }
  }
}

async function Play(connection, data, message) {
  embed = validation.clearEmbed(embed);
  data.videoData = await ytdlVideo.getInfo(data.queue[0]);
  showVideoData(message, data.videoData, "play");
  try {
    data.dispatcher = await connection.play(
      await ytdlVideo(data.queue[0]),
      streamOptions
    );
  } catch (err) {
    message.reply("WRONG URL");
  }
  data.dispatcher.on("finish", function(reason) {
    console.log(reason);
    finish(connection, data, reason, message);
  });
}

async function finish(connection, data, reason, message) {
  data.skippedSong = data.queue.shift();
  if (reason === "rerun") {
    data.skippedSong = "";
  }
  if (reason === "force" || data.queue.length === 0) {
    data.playing = false;
    data.dispatcher = false;
    message.channel.send(`End of queue`);
    connection.disconnect();
  } else {
    Play(connection, data, message);
  }
}

function showVideoData(message, videoData, mode = "play") {
  let durationMin = Math.floor(videoData.length_seconds / 60);
  let durationSec = Math.ceil(videoData.length_seconds % 60);
  let stream = (durationMin && durationSec) === 0;
  embed
    .setColor("#b92727")
    .setAuthor(
      `${videoData.author.name}`,
      `${videoData.author.avatar}`,
      `${videoData.author.channel_url}`
    )
    .setThumbnail(`${videoData.thumbnail_url}`)
    .setDescription(
      `${
        mode === "play"
          ? "Now playing " + videoData.title
          : "Added to queue " + videoData.title
      }`
    )
    .fields.push({
      name: `${stream ? "Live Stream" : "Duration"}`,
      value: `${
        durationMin === 0
          ? `Thanks to ${videoData.author.name}`
          : durationMin + "min"
      }  ${durationSec === 0 ? " " : durationSec + "seconds"} `
    });
  message.channel.send(embed);
}
module.exports = Voice;
