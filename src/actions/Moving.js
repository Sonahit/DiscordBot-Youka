const Discord = require("discord.js");
const embed = new Discord.RichEmbed();
const config = require("../../config/config");
const Validation = require("../Validation");
const validation = new Validation();
class Moving {
  constructor() {
    this.currentChannel = "";
    this.ids = [];
    this.voiceChannels = [];
    this.idInterval;
    this.follows = {
      follow: false,
      user: "no one"
    };
  }
  Move(msg, client) {
    if (
      msg.content === `${config.prefix}moveTo` ||
      msg.content === `${config.prefix}move`
    ) {
      embed.setColor("0xff8040");
      embed.setDescription(
        `Type !move[To] [name] (number) to move a bot or {name}`
      );
      embed.fields.push({
        name: "Avaiable rooms:",
        value: `${this.getRooms(msg.guild.channels)}`
      });
      msg.reply(embed);
    }
    if (msg.content === `${config.prefix}move to me`) {
      msg.member.voiceChannel.join().then(connection => {
        msg.reply(`Successfully connected to ${msg.member.voiceChannel.name}`);
        this.currentChannel = msg.channel.id;
      });
    }
    if (validation.checkBotMove(msg.content)) {
      this.getRooms(msg.guild.channels);
      let split = msg.content.split(" ");
      let channel = this.getChannel(split[1]);
      if (!channel) return console.error("The channel does not exist!");
      channel
        .join()
        .then(connection => {
          msg.reply(`Successfully connected to ${channel.name}`);
          this.currentChannel = msg.channel.id;
          console.log(`Successfully connected to ${channel.name}`);
        })
        .catch(e => {
          // Oh no, it errored! Let's log it to console :)
          console.error(e);
        });
    }
  }
  Follow(msg) {
    if (msg.content === `${config.prefix}follow me`) {
      if (msg.member.voiceChannel && this.follows.follow === false) {
        this.idInterval = setInterval(function() {
          follow(msg);
        }, 1000);
        this.currentChannel = msg.channel.id;
        this.follows.follow = true;
        this.follows.user = msg.author;
      } else {
        msg.author.send(
          `Join to voice channel first or I am following ${
            this.follows.user.username
          }`
        );
      }
    } else if (
      (msg.content === `${config.prefix}stop follow` &&
        this.follows.user.username === msg.author.username) ||
      validation.isAuthor(msg)
    ) {
      clearInterval(this.idInterval);
      this.follows.follow = false;
      this.follows.user = "no one";
    }
  }

  getRooms(channels = []) {
    this.voiceChannels = [];
    this.ids = [];
    let i = 0;
    channels.forEach((item, index) => {
      if (item.type == "voice" && item.joinable === true) {
        this.voiceChannels.push(
          `Channel number ->\t${++i}\t->\t\t${item.name}\n`
        );
        this.ids.push(item.id);
      }
    });
    return this.voiceChannels;
  }
  getChannel(id, client) {
    for (let i = 0; i < this.ids.length; i++) {
      if (i === parseInt(id) - 1) {
        return client.channels.get(this.ids[i]);
      }
    }
  }
}

function follow(msg) {
  msg.member.voiceChannel.join();
}

module.exports = Moving;
