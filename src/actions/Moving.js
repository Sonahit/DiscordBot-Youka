this.voiceChannels = [];
const Discord = require("discord.js");
const embed = new Discord.RichEmbed();
const config = require("../../config/config");

module.exports = class Moving {
  cunstructor() {
    this.currentChannel = "";
    this.ids = [];
  }
  Move(msg, client) {
    if (msg.content === `${config.prefix}moveTo` ||
        msg.content === `${config.prefix}move` ) {
        embed.setColor("0xff8040");
        embed.setDescription(`Type !move[To] [name] (number) to move a bot or {name}`)
        embed.fields.push({
            name: "Avaiable rooms:",
            value: `${getRooms(msg.guild.channels)}`
        })
      msg.reply(embed);
    }
    if (msg.content === "!move to me") {
      msg.member.voiceChannel.join().then(connection => {
        msg.reply(`Successfully connected to ${msg.member.voiceChannel.name}`);
        this.currentChannel = channel.id;
      });
    }
    if (checkBotMove(msg.content)) {
      getRooms(msg.guild.channels);
      let split = msg.content.split(" ");
      let channel = getChannel(split[1], client);
      if (!channel) return console.error("The channel does not exist!");
      channel
        .join()
        .then(connection => {
          msg.reply(`Successfully connected to ${channel.name}`);
          this.currentChannel = channel.id;
          console.log(`Successfully connected to ${channel.name}`);
        })
        .catch(e => {
          // Oh no, it errored! Let's log it to console :)
          console.error(e);
        });
    }
    if (checkMoveUser(msg.content)) {
      getRooms(msg.guild.channels);
      let split = msg.content.split(" ");
      let user = getUser(split[1], client);
      let idChannel = split[2];
      let channel = getChannel(idChannel, client);
      if (channel && user) {
        if (user.voiceChannel !== channel) {
          msg.reply(`moved @${user.user.username} to ${channel.name}`);
          user.setVoiceChannel(channel);
        } else {
          msg.reply(`@${user.user.username} already in it`);
        }
      } else {
        msg.reply(`Cannot move `);
      }
    }
  }
};

function getUser(name = "", client) {
  for (guild of client.guilds) {
    for (user of guild[1].members) {
      if (name === user[1].user.username) {
        return user[1];
      }
    }
  }
}

function getRooms(channels = []) {
  voiceChannels = [];
  this.ids = [];
  let i = 0;
  for (channel of channels) {
    if (channel[1].type == "voice" && channel[1].joinable === true) {
      voiceChannels.push(`Channel number ->\t${++i}\t->\t\t${channel[1].name}\n`);
      this.ids.push(channel[1].id);
    }
  }
  return voiceChannels;
}

function checkBotMove(msg = "") {
 // let pattern = /!(move|moveTo)\s\d+/g
  let pattern = new RegExp(`${config.prefix}(move|moveTo) *[0-9]+`,'g');
  let check = pattern.test(msg);
  return check;
}

function getChannel(id, client) {
  for (let i = 0; i < ids.length; i++) {
    if (i === parseInt(id) - 1) {
      return client.channels.get(ids[i]);
    }
  }
}

function checkMoveUser(msg = "") {
  //let pattern = /!(move|moveTo)(\s*(\w|[А-Яа-я])+\s[0-9]*)/g;
  let pattern = new RegExp(`${config.prefix}(move|moveTo) *(\w|[А-Яа-я])+ [0-9]+`,'g')
  let check = pattern.test(msg);
  return check;
}
