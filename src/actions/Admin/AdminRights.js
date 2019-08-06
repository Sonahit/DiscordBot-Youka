const validation = global.Validation;
const moving = global.Moving;
const config = validation.config;
const Discord = require("discord.js");

class AdminRights {
  constructor(mode = "user") {
    this._mode = mode;
    this._ids = [];
  }

  get mode() {
    return this._mode;
  }

  get ids() {
    return this._ids;
  }

  set ids(ids) {
    this._ids = ids;
  }
  set mode(mode) {
    this._mode = mode;
  }

  IAdmin(msg) {
    this.mode = "admin";
    msg.author.send(
      `<@${msg.author.id}>, you set bot to admin mode be careful!`
    );
  }

  IUser(msg) {
    this.mode = "user";
    msg.author.send(`I am ordinary user :slight_smile:`);
  }

  kick(msg) {
    if (isAdmin(this.mode)) {
      const user = msg.mentions.users.first();
      if (user) {
        const member = msg.guild.member(user);
        let reason = msg.content.split(` <@${member.user.id}> `)[1];
        if (member) {
          member
            .kick()
            .then(() => {
              msg.reply(`Successfully kicked ${user.tag} because ${reason}`);
            })
            .catch(err => {
              msg.reply("I was unable to kick the member");
              console.error(err);
            });
        } else {
          msg.reply("You didn't mention the user to kick!");
        }
      } else {
        msg.reply("That user isn't in this guild!");
      }
    } else {
      msg.reply(`You have to enter admin mode`);
    }
  }
  /*
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
*/
  mute(msg) {
    if (isAdmin(this.mode)) {
      const user = msg.mentions.users.first();
      if (user) {
        const member = msg.guild.member(user);
        let reason =
          msg.content.split(` <@${member.user.id}> `)[1] || "no reason";
        if (member) {
          member
            .setMute(true, reason)
            .then(() => {
              msg.reply(`Successfully muted ${user.tag} because ${reason}`);
            })
            .catch(err => {
              msg.reply("I was unable to mute the member");
              console.error(err);
            });
        } else {
          msg.reply("You didn't mention the user to mute!");
        }
      } else {
        msg.reply("That user isn't in this guild!");
      }
    } else {
      msg.reply(`You have to enter admin mode`);
    }
  }

  unmute(msg) {
    if (isAdmin(this.mode)) {
      const user = msg.mentions.users.first();
      if (user) {
        const member = msg.guild.member(user);
        let reason =
          msg.content.split(` <@${member.user.id}> `)[1] || "no reason";
        if (member) {
          member
            .setMute(false, reason)
            .then(() => {
              msg.reply(`Successfully unmuted ${user.tag}`);
            })
            .catch(err => {
              msg.reply("I was unable to unmute the member");
              console.error(err);
            });
        } else {
          msg.reply("That user isn't in this guild!");
        }
      } else {
        msg.reply("You didn't mention the user to unmute!");
      }
    } else {
      msg.reply(`You have to enter admin mode`);
    }
  }

  move(msg, client) {
    if (isAdmin(this.mode)) {
      if (validation.checkMoveUser(msg.content) || msg.mentions.users.first()) {
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
    msg.send(`...Started!`);
  }

  async restart(msg, client) {
    msg.author.send(`...Restarting`);
    await this.disconnect(msg, client);
    client.login(config.token);
    await this.Start(msg.author);
  }
  disconnect(msg, client) {
    msg.author.send(`...Disconnected`);
    client.destroy();
  }

  blacklist(msg) {
    validation
      .addToBlacklist(msg)
      .then(() => {
        msg.reply("Added to blacklist");
      })
      .catch(err => {
        msg.reply(err.message);
      });
  }

  whitelist(msg) {
    validation
      .addToWhitelist(msg)
      .then(() => {
        msg.reply("Added to whitelist");
      })
      .catch(err => {
        msg.reply(err.message);
      });
  }

  remove_whitelist(msg) {
    const author = msg.guild.member(msg.mentions.users.first()).user;
    let index = config.whitelist.findIndex(user => {
      return user.id === author.id;
    });
    if (index >= 0) {
      config.whitelist.splice(index, 1);
      msg.reply("Removed from whitelist");
    } else {
      msg.reply("Didn't Remove from whitelist");
    }
  }
  remove_blacklist(msg) {
    const author = msg.guild.member(msg.mentions.users.first()).user;
    let index = config.blacklist.findIndex(user => {
      return user.id === author.id;
    });
    if (index >= 0) {
      config.blacklist.splice(index, 1);
      msg.reply("Removed from whitelist");
    } else {
      msg.reply("Didn't remove from blacklist");
    }
  }

  show_whitelist(msg) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Members of Whitelist");
    embed.setColor("#ffffff");
    config.whitelist.forEach((user, index) => {
      embed.addField(`#${index + 1}`, `Name: ${user.username}`);
    });
    msg.reply(embed);
  }

  show_blacklist(msg) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Members of Blacklist");
    embed.setColor("#000000");
    config.blacklist.forEach((user, index) => {
      embed.addField(`#${index + 1}`, `Name: ${user.username}`);
    });
    msg.reply(embed);
  }

  async test(msg) {
    const { VK } = require("vk-io");
    const vk = new VK({
      token: config.VKAPI.ACCESS_TOKEN,
      language: "ru"
    });
    const friendIDs = await vk.api.friends.get();
    const promises = [];
    friendIDs.items.forEach(id => {
      promises.push(
        vk.api.users.get({
          user_ids: id,
          fields: config.VKAPI.USER_PARAMS
        })
      );
    });
    const response = await Promise.all(promises);
    let user = response.filter(user => {
      user = user[0];
      return user.first_name === "Никита" && user.last_name === "Симаков";
    });
    user = user[0][0];
    const { MessageEmbed } = require("discord.js");
    const embed = new MessageEmbed();
    embed.setAuthor(
      `${user.first_name} ${user.last_name}`,
      user.photo_max_orig
    );
    embed.setColor("#ffc0cb");
    embed.setDescription(
      "Я не рекомендую переходить по [этой](http://xxx.com) ссылке"
    );
    embed.setTitle("Test isn't for fun");
    msg.channel.send(embed);
  }
}

function getUser(name = "", client) {
  for (let guild of client.guilds) {
    return guild[1].members.find(user => {
      if (name === user.user.username) {
        return user;
      }
    });
  }
}

function isAdmin(mode) {
  return mode == "admin";
}

module.exports = AdminRights;
