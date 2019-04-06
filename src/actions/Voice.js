const ytdlVideo = require("ytdl-core");
const ytdl = require("ytdl-core-discord");
const streamOptions = { volume: 0.03, passes: 3 };
const fileOptions = { volume: 0.15, passes: 3 };
const Discord = require("discord.js");
const embed = new Discord.RichEmbed();
const config = require("../../config/config");

function Play(connection, data, message) {
  embed.setColor("#b92727");
  embed.setAuthor(
    `${data.info.author.name}`,
    `${data.info.author.avatar}`,
    `${data.info.author.user_url}`
  );
  embed.setThumbnail(`${data.info.thumbnail_url}`);
  embed.setDescription(`Now playing ${data.info.title}`);
  embed.fields.push({
    name: "Duration",
    value: `${Math.floor(data.info.length_seconds / 60)} min ${Math.ceil(
      data.info.length_seconds % 60
    )} seconds`
  });
  message.channel.send({ embed });
  data.dispatcher = connection.playStream(
    ytdlVideo(data.queue[0], { filter: "audioonly" }),
    streamOptions
  );
  data.dispatcher.on("end", function(reason) {
    finish(connection, data, reason);
  });
}

function finish(connection, data, reason) {
  data.queue.shift();
  if (data.queue.length != 0) {
    Play(connection, data);
  } else {
    data.playing = false;
    console.log(reason);
    connection.disconnect();
  }
}

async function Stream(connection, data, url) {
  data.dispatcher = connection.playOpusStream(await ytdl(url), streamOptions);
  embed.setColor("0x9f930f");
  embed.setAuthor(
    `${data.info.author.name}`,
    `${data.info.author.avatar}`,
    `${data.info.author.user_url}`
  );
  embed.setThumbnail(`${data.info.thumbnail_url}`);
  embed.setDescription(`Now streaming ${data.info.title}`);
  message.channel.send({ embed });
  data.dispatcher.on("debug", info => {
    console.log("debug");
    console.log(info);
  });
  data.dispatcher.on("error", info => {
    console.log("error");
    data.streaming = false;
    console.log(info);
  });
  data.dispatcher.on("end", reason => {
    console.log("end");
    data.streaming = false;
    console.log(reason);
  });
}
class Voice {
  constructor() {
    this.data = {
      dispatcher: false,
      info: "",
      queue: [],
      playing: false,
      streaming: false
    };
  }
  Join(message) {
    if (message.member != null) {
      if (message.member.voiceChannel) {
        message.member.voiceChannel.join();
      } else {
        embed.setColor("0xff0000");
        embed.setDescription("You need to join a voice channel first!");
        message.reply(embed);
      }
    } else {
      const current = message.author;
      embed.setColor("0xff0000");
      embed.setDescription(`Stop typying me in pm :angry: `);
      current.send(embed);
    }
  }
  Disconnect(message) {
    message.member.voiceChannel.leave();
  }
  Play(message) {
    if (message.member != null && this.data.streaming == false) {
      if (message.content === `${config.prefix}playtest`) {
        if (message.member.voiceChannel) {
          message.member.voiceChannel
            .join()
            .then(connection => {
              this.data.dispatcher = connection.playFile(
                "http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p",
                fileOptions
              );
            })
            .catch(console.error);
        } else {
          embed.setColor("0xff0000");
          embed.setDescription("You need to join a voice channel first!");
          message.reply(embed);
        }
      } else {
        let url = message.content.split(" ")[1];
        if (this.data.playing || this.data.queue > 0) {
          //this.data.queue.push(url);
          embed.setColor("0x004444");
          embed.setDescription("Music still playing. WAIT!");
          message.reply(embed);
        } else {
          if (message.member.voiceChannel) {
            this.data.playing = true;
            this.data.queue.push(url);
            message.member.voiceChannel
              .join()
              .then(async connection => {
                this.data.info = await ytdlVideo.getInfo(url);
                Play(connection, this.data, message);
              })
              .catch(console.error);
          } else {
            embed.setColor("0xff0000");
            embed.setDescription("You need to join a voice channel first!");
            message.reply(embed);
          }
        }
      }
    } else {
      const current = message.author;
      embed.setColor("0x004444");
      embed.setDescription(`I am streaming! `);
      current.send(embed);
    }
  }
  Stream(message) {
    if (message.member != null) {
      if (message.member.voiceChannel) {
        let url = message.content.split(" ")[1];
        message.member.voiceChannel
          .join()
          .then(async connection => {
            this.data.info = await ytdlVideo.getInfo(url);
            Stream(connection, this.data, url);
          })
          .catch(console.error);
      } else {
        embed.setColor("0xff0000");
        embed.setDescription("You need to join a voice channel first!");
        message.reply(embed);
      }
    } else {
      const current = message.author;
      embed.setColor("0xff0000");
      embed.setDescription(`Stop typying me in pm :angry: `);
      current.send(embed);
    }
  }
  Radio(message) {
    if (message.member != null) {
      if (message.member.voiceChannel) {
        message.member.voiceChannel
          .join()
          .then(connection => {
            require("http").get(
              "http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p",
              res => {
                connection.playStream(res, streamOptions);
                embed.setColor("#b92727");
                embed.setDescription("Playing radio!");
                embed.setAuthor(
                  `${message.member.user.username}`,
                  `${message.member.user.avatarURL ||
                    "https://pmcvariety.files.wordpress.com/2018/05/discord-logo.jpg?w=1000&h=563&crop=1"}`,
                  `http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p`
                );
                embed.setThumbnail(
                  "http://www.modelradiolive.net/wp-content/uploads/2017/06/radio_mike.jpg"
                );
                message.channel.send(embed);
              }
            );
          })
          .catch(console.error);
      } else {
        message.reply("You need to join a voice channel first!");
      }
    } else {
      const current = message.author;
      current.send(`Stop typying me in pm :angry: `);
    }
  }
  Pause(message) {
    if (message.member.voiceChannel && this.data.dispatcher != false) {
      this.data.dispatcher.pause();
    }
  }
  Resume(message) {
    if (message.member.voiceChannel && this.data.dispatcher != false) {
      this.data.dispatcher.resume();
    }
  }
  End(message) {
    if (message.member.voiceChannel && this.data.dispatcher != false) {
      this.data.dispatcher.end();
      this.data.playing = false;
    }
  }
  changeVolume(message) {
    if (message.member.voiceChannel && this.data.dispatcher != false) {
      var volume = message.content.substring(8, message.content.length);
      this.data.dispatcher.setVolume(parseFloat(volume / 100));
    }
  }
}
module.exports = Voice;
