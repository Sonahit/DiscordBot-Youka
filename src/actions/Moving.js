const Discord = require("discord.js");
let embed = new Discord.MessageEmbed();
const Validation = require("../Validation");
const validation = new Validation();
const config = validation.config;

class Moving {
  constructor() {
    this._currentChannel = "";
    this._channelIds = [];
    this._idInterval;
    this._follows = {
      follow: false,
      user: "no one"
    };
  }

  get currentChannel() {
    return this._currentChannel;
  }

  get channelIds() {
    return this._channelIds;
  }

  get idInterval() {
    return this._idInterval;
  }

  get follows() {
    return this._follows;
  }

  set currentChannel(currentChannel) {
    this._currentChannel = currentChannel;
  }

  set channelIds(channelIds) {
    this._channelIds = channelIds;
  }

  set idInterval(idInterval) {
    this._idInterval = idInterval;
  }

  set follows(follows) {
    this._follows = follows;
  }

  moveTo(msg) {
    if (msg.content === `${config.prefix}moveTo`) {
      embed = validation.clearEmbed(embed);
      embed.setColor("0xff8040");
      embed.setDescription(
        `Type ${config.prefix}moveTo (number) to move bot to certain channel`
      );
      this.getRooms(msg.guild.channels).forEach(channel => {
        embed.addField(`Room #${channel.id}`, `\`\`\` ${channel.name} \`\`\``);
      });
      msg.reply(embed);
    } else if (msg.content === `${config.prefix}moveTo me`) {
      msg.member.voice.channel.join().then(() => {
        msg.reply(`Successfully connected to ${msg.member.voice.channel.name}`);
        this.currentChannel = msg.channel.id;
      });
    } else if (validation.checkBotMove(msg.content)) {
      this.getRooms(msg.guild.channels);
      let voiceNumber = msg.content.split(" ")[1];
      let channel = this.getChannel(voiceNumber, msg);
      if (!channel) return console.error("The channel does not exist!");
      channel
        .join()
        .then(() => {
          msg.reply(`Successfully connected to ${channel.name}`);
          this.currentChannel = msg.channel.id;
          console.log(`Successfully connected to ${channel.name}`);
        })
        .catch(e => {
          // Oh no, it errored! Let's log it to console :)
          console.error(e);
          console.error("The channel does not exist!");
        });
    }
  }
  follow(msg, client) {
    let user;
    if ((user = msg.guild.member(msg.mentions.users.first()))) {
      this["follow user"](msg, client, user);
    }
    if (msg.content.includes("follow me")) {
      this["follow me"](msg, client);
    } else if (msg.content.includes("follow stop")) {
      this["follow stop"](msg, client);
    }
  }
  "follow user"(msg, client, user) {
    if (user.voice.channel && this.follows.follow === false) {
      this.idInterval = setInterval(function() {
        followUser(msg, user, this);
      }, 1000);
      this.follows.follow = true;
      this.follows.user = user.user;
      msg.channel.send(`Following <@${this.follows.user.id}>`);
    } else {
      user.send(
        `Join to voice channel first or I am following <@${this.follows.id}>`
      );
    }
  }
  "follow me"(msg, client) {
    if (msg.member.voice.channel && this.follows.follow === false) {
      this.idInterval = setInterval(function() {
        follow(msg, client, this);
      }, 1000);
      this.follows.follow = true;
      this.follows.user = msg.author;
      msg.channel.send(`Following <@${msg.author.id}>`);
    } else {
      msg.author.send(
        `Join to voice channel first or I am following <@${this.follows.id}>`
      );
    }
  }

  "follow stop"(msg) {
    if (
      (msg.content === `${config.prefix}follow stop` &&
        this.follows.user.username === msg.author.username) ||
      (validation.isAuthor(msg) ||
        validation.isRole(msg, "Модератор") ||
        validation.isRole(msg, "DJ"))
    ) {
      if (this.follows.follow) {
        clearInterval(this.idInterval);
        msg.channel.send(`Stopped following <@${this.follows.user.id}>`);
        this.follows.user = "no one";
        this.follows.follow = false;
      } else {
        if (this.follows.user !== "no one") {
          msg.reply(`I am following <@${this.follows.user.id}>`);
        } else {
          msg.reply(`I am not following anyone`);
        }
      }
    } else {
      msg.author.send(`I am not following you >:C`);
    }
  }

  getRooms(channels = []) {
    let voiceChannels = [];
    this.channelIds = [];
    let i = 0;
    channels.forEach(item => {
      if (item.type == "voice" && item.joinable === true) {
        voiceChannels.push({
          id: ++i,
          name: item.name
        });
        this.channelIds.push(item.id);
      }
    });
    return voiceChannels;
  }

  getChannel(id, msg) {
    for (let i = 0; i < this.channelIds.length; i++) {
      if (i === parseInt(id) - 1) {
        return msg.guild.channels.get(this.channelIds[i]);
      }
    }
  }
}

function follow(msg, client, object) {
  // if(msg.member.voiceChannel != )
  if (msg.member != null) {
    msg.member.voice.channel.join();
    object.currentChannel = msg.member.voice.channel.name;
  } else {
    clearInterval(object.idInterval);
    object.follows.follow = false;
    object.follows.user = "no one";
  }
}

function followUser(msg, user, object) {
  // if(msg.member.voiceChannel != )
  if (user != null) {
    user.voice.channel.join();
    object.currentChannel = user.voice.channel.name;
  } else {
    clearInterval(object.idInterval);
    object.follows.follow = false;
    object.follows.user = "no one";
  }
}

module.exports = Moving;
