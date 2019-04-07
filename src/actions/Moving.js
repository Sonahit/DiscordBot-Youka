const Discord = require("discord.js");
let embed = new Discord.RichEmbed();
const Validation = require("../Validation");
const validation = new Validation();
const config = validation.config;

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

  moveTo(msg, client) {
    if (
      msg.content === `${config.prefix}moveTo` ||
      msg.content === `${config.prefix}move`
    ) {
      embed = validation.clearEmbed(embed);
      embed.setColor("0xff8040");
      embed.setDescription(`Type !moveTo (number) to move a bot`);
      embed.fields.push({
        name: "Avaiable rooms:",
        value: `${this.getRooms(msg.guild.channels)}`
      });
      msg.reply(embed);
    }
    if (msg.content === `${config.prefix}moveTo me`) {
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
  follow(msg, client) {
    if(msg.content.includes("follow me")){
      this["follow me"](msg,client);
    } else if (msg.content.includes("follow stop")){
      this["follow stop"](msg,client);
    }
  }

  "follow me"(msg, client) {
      if (msg.member.voiceChannel && this.follows.follow === false) {
        this.idInterval = setInterval(function() {
          follow(msg, client);
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
  }

  "follow stop"(msg){
    if (
      (msg.content === `${config.prefix}follow stop` &&
        this.follows.user.username === msg.author.username) ||
      validation.isAuthor(msg) || this.follows.follow
    ) {
      clearInterval(this.idInterval);
      this.follows.follow = false;
      this.follows.user = "no one"; 
    } else {
      msg.author.send(
        `I am not following you >:C ${
          this.msg.author.username
        } or I am already following someone :D`
      );
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

function follow(msg, client) {
  // if(msg.member.voiceChannel != )
  msg.member.voiceChannel.join();
}

module.exports = Moving;
