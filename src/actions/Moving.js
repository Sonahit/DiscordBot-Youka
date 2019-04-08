const Discord = require("discord.js");
let embed = new Discord.RichEmbed();
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

  get currentChannel(){
    return this._currentChannel;
  }

  get channelIds(){
    return this._channelIds;
  }

  get idInterval(){
    return this._idInterval;
  }

  get follows(){
    return this._follows;
  }

  set currentChannel(currentChannel){
    this._currentChannel = currentChannel;
  }

  set channelIds(channelIds){
    this._channelIds = channelIds;
  }

  set idInterval(idInterval){
    this._idInterval = idInterval;
  }

  set follows(follows){
    this._follows = follows;
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
    let user;
    if((user = msg.guild.member(msg.mentions.users.first()))){
      this["follow user"](msg,client, user);
    }
    if (msg.content.includes("follow me")) {
      this["follow me"](msg, client);
    } else if (msg.content.includes("follow stop")) {
      this["follow stop"](msg, client);
    }
  }
  "follow user"(msg, client, user){
    if (user.voiceChannel && this.follows.follow === false) {
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
    if (msg.member.voiceChannel && this.follows.follow === false) {
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
        this.follows.user.username === msg.author.username) 
        || (validation.isAuthor(msg) 
        || validation.isRole(msg, "Модератор")
        || validation.isRole(msg, "DJ"))
    ) {
     if( this.follows.follow ){
      clearInterval(this.idInterval);
      msg.channel.send(`Stopped following <@${this.follows.user.id}>`);
      this.follows.user = "no one";
      this.follows.follow = false;
     } else {
       if(this.follows.user !== "no one"){
        msg.reply(`I am following <@${this.follows.user.id}>`);
       } else {
        msg.reply(`I am not following anyone`);
       }
     }
    } else {
      msg.author.send(
        `I am not following you >:C`
      );
    }
  }

  getRooms(channels = []) {
    voiceChannels = [];
    this.channelIds = [];
    let i = 0;
    channels.forEach((item, index) => {
      if (item.type == "voice" && item.joinable === true) {
        voiceChannels.push(
          `Channel number ->\t${++i}\t->\t\t${item.name}\n`
        );
        this.channelIds.push(item.id);
      }
    });
    return voiceChannels;
  }

  getChannel(id, client) {
    for (let i = 0; i < this.channelIds.length; i++) {
      if (i === parseInt(id) - 1) {
        return client.channels.get(this.channelIds[i]);
      }
    }
  }
}

function follow(msg, client, object) {
  // if(msg.member.voiceChannel != )
  if(msg.member != null){
    msg.member.voiceChannel.join();
    object.currentChannel = msg.member.voiceChannel.name;
  } else {
    clearInterval(object.idInterval);
    object.follows.follow = false;
    object.follows.user = "no one";
  }
}

function followUser(msg, user, object) {
  // if(msg.member.voiceChannel != )
  if(user != null){
    user.voiceChannel.join();
    object.currentChannel = user.voiceChannel.name;
  } else {
    clearInterval(object.idInterval);
    object.follows.follow = false;
    object.follows.user = "no one";
  }
}

module.exports = Moving;
