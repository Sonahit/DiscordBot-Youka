const ytdlVideo = require("ytdl-core");
const streamOptions = { volume: 0.03, passes: 3 };
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

  join(msg) {
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
    msg.member.voice.channel.leave();
    this.data.playing = false;
    this.data.queue = [];
    this.data.onAir = false;
  }

  async play(msg) {
    if (msg.member != null && !this.data.onAir) {
      embed = validation.clearEmbed(embed);
      let url = msg.content.split(" ")[1];
      if (this.data.playing || this.data.queue > 0) {
        this.data.queue.push(url);
        let videoData = await ytdlVideo.getInfo(url);
        showVideoData(msg, videoData, "queue");
      } else {
        if (msg.member.voice.channel) {
          embed = validation.clearEmbed(embed);
          this.data.playing = true;
          this.data.queue.push(url);
          msg.member.voice.channel
            .join()
            .then(async connection => {
              this.data.videoData = await ytdlVideo.getInfo(url);
              Play(connection, this.data, msg);
            })
            .catch(console.error);
        } else {
          embed
            .setColor("0xff0000")
            .setDescription("You need to join a voice channel first!");
          msg.reply(embed);
        }
      }
    } else {
      embed = validation.clearEmbed(embed);
       if (this.data.onAir) {
        embed.setColor("0x004444").setDescription(`Radio is on air!`);
      } else if (this.data.playing) {
        embed.setColor("0x004444").setDescription(`I am playing a song!`);
      }
      msg.channel.send(embed);
    }
  }

  radio(msg) {
    if (msg.member != null) {
      if (
        msg.member.voice.channel &&
        !this.data.onAir &&
        !this.data.playing
      ) {
        embed = validation.clearEmbed(embed);
        msg.member.voice.channel
          .join()
          .then(async connection => {
            embed = validation.clearEmbed(embed);
            http.get(
              await awaitRadioChoose(msg, msg.author, embed),
              res => {
                this.data.onAir = true;
                this.data.dispatcher = connection.play(res, streamOptions);
              }
            );
          })
          .catch(console.error);
      } else {
        embed = validation.clearEmbed(embed);
        if (this.data.onAir) {
          embed.setColor("0x004444").setDescription(`Radio is on air!`);
        } else if (this.data.playing) {
          embed.setColor("0x004444").setDescription(`I am playing a song!`);
        } else {
          embed
            .setColor("0xff0000")
            .setDescription("You need to join a voice channel first!");
        }
        msg.channel.send(embed);
      }
    } else {
      const current = msg.author;
      current.send(`Stop typying me in pm :angry: `);
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

  async stop(msg, client, mode = "force") {
    if (msg.content === `${config.prefix}stop` || mode === "skip" || this.data.dispatcher) {
      if (
        msg.member.voice.channel &&
        !this.data.onAir &&
        this.data.playing === true
      ) {
        if (mode === "force") {
          this.data.dispatcher.end("force");
          this.data.dispatcher = false;
          this.data.playing = false;
          msg.reply(`Stopped playing songs`);
        } else {
          this.data.dispatcher.end("skip");
          msg.reply(`Skipped song`);
        }
      } else if(this.data.onAir) {
        this.data.onAir = false;
        msg.reply(`Shutting down radio...`);
        http.globalAgent.destroy();
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
      let volume = msg.content.substring(8, msg.content.length);
      if (volume <= 200) {
        this.data.dispatcher.setVolume(parseFloat(volume / 1000));
      } else {
        msg.reply(`You exited available range of sound try to use 0 - 200`);
      }
    }
  }

  async queue(msg) {
    embed = validation.clearEmbed(embed);
    if (this.data.playing === true) {
      await awaitEmbedReply(msg, this.data, embed);
    } else {
      msg.reply(`No queue`);
    }
  }

  rerun(msg) {
    embed = validation.clearEmbed(embed);
    if (this.data.skippedSong != null && this.data.skippedSong != false) {
      this.data.queue.unshift(this.data.skippedSong);
      this.data.queue.unshift(this.data.skippedSong);
      this.data.dispatcher.end("rerun");
    } else {
      msg.reply(`You didn't skip any song`);
    }
  }
}

async function Play(connection, data, msg) {
  embed = validation.clearEmbed(embed);
  data.videoData = await ytdlVideo.getInfo(data.queue[0]);
  showVideoData(msg, data.videoData, "play");
  try {
    data.dispatcher = await connection.play(
      await ytdlVideo(data.queue[0]),
      streamOptions
    );
    console.log('STARTED PLAYING SONG');
  } catch (err) {
    msg.reply("WRONG URL");
  }
  data.dispatcher.on("finish", function(reason) {
    console.log(`FINISHED PLAYING A SONG BECAUSE ${reason}`);
    finish(connection, data, reason, msg);
  });
}

async function finish(connection, data, reason, msg) {
  data.skippedSong = data.queue.shift();
  if (reason === "rerun") {
    data.skippedSong = "";
  }
  if (reason === "force" || data.queue.length === 0) {
    data.playing = false;
    data.dispatcher = false;
    msg.channel.send(`End of queue`);
    if(reason === "force"){
      data.queue = [];
    }
    connection.disconnect();
  } else {
    Play(connection, data, msg);
  }
}

function showVideoData(msg, videoData, mode = "play") {
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
  msg.channel.send(embed);
}
module.exports = Voice;
