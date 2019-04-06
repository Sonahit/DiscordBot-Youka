const config = require("../../config/config");
const Discord = require("discord.js");
const embed = new Discord.RichEmbed();
const Moving = require("./Moving");
const moving = new Moving();
const Validation = require("../Validation");
const validation = new Validation();

module.exports = class AdminRights {
  constructor(mode = "user") {
    this.mode = mode;
    this.ids = [];
  }
  getMode() {
    return this.mode;
  }

  setMode(mode) {
    this.mode = mode;
  }

  Kick(message) {
    if (isAdmin(this.getMode())) {
      const user = message.mentions.users.first();
      if (user) {
        const member = message.guild.member(user);
        let reason = message.content.split(` <@${member.user.id}> `)[1];
        if (member) {
          member
            .kick()
            .then(() => {
              message.author.send(
                `Successfully kicked ${user.tag} because ${reason}`
              );
            })
            .catch(err => {
              message.author.send("I was unable to kick the member");
              console.error(err);
            });
        } else {
          message.author.send("You didn't mention the user to kick!");
        }
      } else {
        message.author.send("That user isn't in this guild!");
      }
    } else {
      message.author.send(`You have to enter admin mode`);
    }
  }

  Ban(msg) {
    if (isAdmin(this.getMode())) {
    } else {
      msg.author.send(`You have to enter admin mode`);
    }
  }
  unBan(msg) {
    if (isAdmin(this.getMode())) {
    } else {
      msg.author.send(`You have to enter admin mode`);
    }
  }

  Mute(message) {
    if (isAdmin(this.getMode())) {
      const user = message.mentions.users.first();
      if (user) {
        const member = message.guild.member(user);
        let reason = message.content.split(` <@${member.user.id}> `)[1];
        if (member) {
          member
            .setMute(true, reason)
            .then(() => {
              message.author.send(
                `Successfully muted ${user.tag} because ${reason}`
              );
            })
            .catch(err => {
              message.author.send("I was unable to mute the member");
              console.error(err);
            });
        } else {
          message.author.send("You didn't mention the user to mute!");
        }
      } else {
        message.author.send("That user isn't in this guild!");
      }
    } else {
      message.author.send(`You have to enter admin mode`);
    }
  }

  unMute(message) {
    if (isAdmin(this.getMode())) {
      const user = message.mentions.users.first();
      if (user) {
        const member = message.guild.member(user);
        if (member) {
          member
            .setMute(false, reason)
            .then(() => {
              message.author.send(`Successfully unmuted ${user.tag}`);
            })
            .catch(err => {
              message.author.send("I was unable to unmute the member");
              console.error(err);
            });
        } else {
          message.author.send("You didn't mention the user to unmute!");
        }
      } else {
        message.reply("That user isn't in this guild!");
      }
    } else {
      message.author.send(`You have to enter admin mode`);
    }
  }

  Move(msg, client) {
    if (isAdmin(this.getMode())) {
      if (validation.checkMoveUser(msg.content)) {
        moving.getRooms(msg.guild.channels);
        let split = msg.content.split(" ");
        let user = getUser(split[1], client);
        let idChannel = split[2];
        let channel = moving.getChannel(idChannel, client);
        if (channel && user) {
          if (user.voiceChannel !== channel) {
            msg.reply(`moved <@${user.user.id}> to ${channel.name}`);
            user.setVoiceChannel(channel);
          } else {
            msg.reply(`@${user.user.username} already in it`);
          }
        } else {
          msg.reply(`Cannot move `);
        }
      } else {
        msg.reply(`Cannot move `);
      }
    } else {
      msg.author.send(`You have to enter admin mode`);
    }
  }
};

function getUser(name = "", client) {
  let obtained;
  for (let guild of client.guilds) {
    obtained = guild[1].members.find(user => {
      if (name === user.user.username) {
        return user;
      }
    });
  }
  console.log(obtained);
  return obtained;
}

function isAdmin(mode) {
  return mode == "admin";
}