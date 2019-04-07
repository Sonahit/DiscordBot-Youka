const Validation = require("../Validation");
const validation = new Validation();
const config = validation.config;
const AdminRights = require("../actions/AdminRights");
module.exports = class Text extends AdminRights {
  constructor() {
    super();
    this.users = new Map();
    this.mutedRole = "";
  }

  flush(message, client) {
    this.setMuteRole(message);
    if (classes.Admin.getMode() === "admin" && message.content === `${config.prefix}flush`) {
      message.channel
        .fetchMessages()
        .then(messages =>
          messages
            .array()
            .forEach(
              message => message.author.equals(client.user) && message.delete()
            )
        );
    } else if (classes.Admin.getMode() === "admin" && message.content === `${config.prefix}flush me`){
        this["flush me"](message, client);
    } else if (classes.Admin.getMode() === "admin" && message.content === `${config.prefix}flush all`){
        this["flush all"](message, client);
    } else {
      message.reply(`You have to enter admin mode`);
    }
  }

  "flush all"(message, client) {
    this.setMuteRole(message);
    if (classes.Admin.getMode() === "admin") {
      message.channel
        .fetchMessages()
        .then(messages =>
          messages
            .array()
            .forEach(
              message => message.delete()
            )
        );
    } else {
      message.reply(`You have to enter admin mode`);
    }
  };

  "flush me"(message, client) {
    this.setMuteRole(message);
    if (classes.Admin.getMode() === "admin") {
      message.channel
        .fetchMessages()
        .then(messages =>
          messages
            .array()
            .forEach(
              msg => message.author.equals(msg.author) && msg.delete()
            )
        );
    } else {
      message.reply(`You have to enter admin mode`);
    }
  };
  Tmute(message, client) {
    this.setMuteRole(message);
    if (classes.Admin.getMode() === "admin") {
      const user = message.mentions.users.first();
      if (user) {
        const member = message.guild.member(user);
        let reason =
          message.content.split(` <@${member.user.id}> `)[1] || "no reason";
        if (member) {
          this.users.set(member, member.roles);
          let roles = [];
          member.roles.forEach((role, index) => {
            roles.push(role);
          });
          member.removeRoles(roles);
          member.addRole(this.mutedRole);
        } else {
          message.reply("You didn't mention the user to mute at textchannels!");
        }
      } else {
        message.reply("That user isn't in this guild!");
      }
    } else {
      message.reply(`You have to enter admin mode`);
    }
  }
  Tunmute(message, client) {
    this.setMuteRole(message);
    if (classes.Admin.getMode() === "admin") {
      const user = message.mentions.users.first();
      if (user) {
        const member = message.guild.member(user);
        let reason =
          message.content.split(` <@${member.user.id}> `)[1] || "no reason";
        if (member) {
          member.removeRole(this.mutedRole);
          this.users.forEach((roles, user) => {
            if (roles) {
              roles.forEach((role, index) => {
                if (role.name !== "@everyone") {
                  member.addRole(role, reason);
                }
              });
            }
          });
          this.users.delete(member);
        } else {
          message.reply("You didn't mention the user to mute at textchannels!");
        }
      } else {
        message.reply("That user isn't in this guild!");
      }
    } else {
      message.reply(`You have to enter admin mode`);
    }
  }
  setMuteRole(message) {
    const serverRoles = message.guild.roles;
    serverRoles.forEach((item, index) => {
      if (item.name === "Muted") {
        this.mutedRole = item;
      }
    });
  }
};
