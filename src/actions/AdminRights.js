const Moving = require("./Moving");
const Validation = require("../Validation");
const validation = new Validation();
const moving = new Moving();

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

  IAdmin(msg) {
    this.setMode("admin");
    msg.author.send(
      `<@${msg.author.id}>, you set bot to admin mode be careful!`
    );
  }

  IUser(msg) {
    this.setMode("user");
    msg.author.send(`I am ordinary user :slight_smile:`);
  }

  kick(message) {
    if (isAdmin(this.getMode())) {
      const user = message.mentions.users.first();
      if (user) {
        const member = message.guild.member(user);
        let reason = message.content.split(` <@${member.user.id}> `)[1];
        if (member) {
          member
            .kick()
            .then(() => {
              message.reply(
                `Successfully kicked ${user.tag} because ${reason}`
              );
            })
            .catch(err => {
              message.reply("I was unable to kick the member");
              console.error(err);
            });
        } else {
          message.reply("You didn't mention the user to kick!");
        }
      } else {
        message.reply("That user isn't in this guild!");
      }
    } else {
      message.reply(`You have to enter admin mode`);
    }
  }

  ban(msg) {
    if (isAdmin(this.getMode())) {
    } else {
      msg.reply(`You have to enter admin mode`);
    }
  }

  unban(msg) {
    if (isAdmin(this.getMode())) {
    } else {
      msg.reply(`You have to enter admin mode`);
    }
  }

  mute(message) {
    if (isAdmin(this.getMode())) {
      const user = message.mentions.users.first();
      if (user) {
        const member = message.guild.member(user);
        let reason =
          message.content.split(` <@${member.user.id}> `)[1] || "no reason";
        if (member) {
          member
            .setMute(true, reason)
            .then(() => {
              message.reply(`Successfully muted ${user.tag} because ${reason}`);
            })
            .catch(err => {
              message.reply("I was unable to mute the member");
              console.error(err);
            });
        } else {
          message.reply("You didn't mention the user to mute!");
        }
      } else {
        message.reply("That user isn't in this guild!");
      }
    } else {
      message.reply(`You have to enter admin mode`);
    }
  }

  unmute(message) {
    if (isAdmin(this.getMode())) {
      const user = message.mentions.users.first();
      if (user) {
        const member = message.guild.member(user);
        let reason =
          message.content.split(` <@${member.user.id}> `)[1] || "no reason";
        if (member) {
          member
            .setMute(false, reason)
            .then(() => {
              message.reply(`Successfully unmuted ${user.tag}`);
            })
            .catch(err => {
              message.reply("I was unable to unmute the member");
              console.error(err);
            });
        } else {
          message.reply("That user isn't in this guild!");
        }
      } else {
        message.reply("You didn't mention the user to unmute!");
      }
    } else {
      message.reply(`You have to enter admin mode`);
    }
  }

  move(msg, client) {
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
      msg.reply(`You have to enter admin mode`);
    }
  }

  Start(msg) {
    msg.author.send(`...Started!`);
  }

  async restart(msg) {
    await this.Start(msg.author);
    current.send(`...Restarting`);
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
