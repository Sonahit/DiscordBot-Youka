import { Message, Client, User, GuildMember } from "discord.js";
import { YUser, AdminCommandsHandler } from "yooka-bot";

import config from "../../../../config/config";
import Discord from "discord.js";

class AdminCommands implements AdminCommandsHandler {
  mode: string;
  ids: number[];

  constructor(mode = "user") {
    this.mode = mode;
    this.ids = [];
  }

  IAdmin(msg: Message) {
    this.mode = "admin";
    msg.author.send(`<@${msg.author.id}>, you set bot to admin mode be careful!`);
  }

  IUser(msg: Message) {
    this.mode = "user";
    msg.author.send(`I am ordinary user :slight_smile:`);
  }

  kick(msg: Message) {
    if (isAdmin(this.mode)) {
      const user = msg.mentions.users.first();
      if (user) {
        const member = msg.guild!.member(user);
        let reason = msg.content.split(` <@${member!.user.id}> `)[1];
        if (member) {
          member
            .kick()
            .then(() => {
              msg.reply(`Successfully kicked ${user.tag} because ${reason}`);
            })
            .catch(err => {
              msg.reply("I was unable to kick the member");
              logger.error(err);
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

  start(author: User) {
    author.send(`...Started!`);
  }

  restart(msg: Message, client: Client) {
    msg.author.send(`...Restarting`);
    this.disconnect(msg, client);
    client.login(config.token);
    this.start(msg.author);
  }

  disconnect(msg: Message, client: Client) {
    msg.author.send(`...Disconnected`);
    client.destroy();
  }

  blacklist(msg: Message) {
    global.validator
      .addToBlackList(msg)
      .then(() => {
        msg.reply("Added to blacklist");
      })
      .catch(err => {
        msg.reply(err.message);
      });
  }

  whitelist(msg: Message) {
    global.validator
      .addToWhiteList(msg)
      .then(() => {
        msg.reply("Added to whitelist");
      })
      .catch(err => {
        msg.reply(err.message);
      });
  }

  remove_whitelist(msg: Message) {
    const mentioned = msg.mentions.users.first() as User;
    if (!msg.guild) return;
    const author = msg.guild.member(mentioned) as GuildMember;
    let index = config.whitelist.findIndex((user: YUser) => {
      return user.id === author.id;
    });
    if (index >= 0) {
      config.whitelist.splice(index, 1);
      msg.reply("Removed from whitelist");
    } else {
      msg.reply("Didn't Remove from whitelist");
    }
  }
  remove_blacklist(msg: Message) {
    const mentioned = msg.mentions.users.first() as User;
    if (!msg.guild) return;
    const author = msg.guild.member(mentioned) as GuildMember;
    let index = config.blacklist.findIndex((user: YUser) => {
      return user.id === author.id;
    });
    if (index >= 0) {
      config.blacklist.splice(index, 1);
      msg.reply("Removed from whitelist");
    } else {
      msg.reply("Didn't remove from blacklist");
    }
  }

  show_whitelist(msg: Message) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Members of Whitelist");
    embed.setColor("#ffffff");
    config.whitelist.forEach((user: YUser, index: number) => {
      embed.addField(`#${index + 1}`, `Name: ${user.username}`);
    });
    msg.reply(embed);
  }

  show_blacklist(msg: Message) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Members of Blacklist");
    embed.setColor("#000000");
    config.blacklist.forEach((user: YUser, index: number) => {
      embed.addField(`#${index + 1}`, `Name: ${user.username}`);
    });
    msg.reply(embed);
  }
}

function isAdmin(mode: string) {
  return mode === "admin";
}

export default AdminCommands;
