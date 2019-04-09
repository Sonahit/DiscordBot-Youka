const Validation = require("../../Validation");
const validation = new Validation();
const config = validation.config;

class AdminText {
  constructor() {
    this._users = new Map();
    this._mutedRole = "";
  }

  get mutedRole() {
    return this._mutedRole;
  }

  get users() {
    return this._users;
  }

  set mutedRole(mutedRole) {
    this._mutedRole = mutedRole;
  }

  set users(users) {
    this._users = users;
  }

  flush(message, client) {
  if(false){
    this.setMuteRole(message);
    if (classes.Admin.mode === "admin") {
      let thisChannel;
      if (message.content === `${config.prefix}flush`) {
        message.channel.messages
          .fetch()
          .then(messages =>
            messages.forEach(
              message => message.author.equals(client.user) && message.delete()
            )
          );
      } else if (
        new RegExp(`${config.prefix}flush .*`, "gi").test(message.content) &&
        (thisChannel = message.guild.channels.find((channel, index) => {
          return (
            channel.name === message.content.split(" ")[1] &&
            channel.type === "text"
          );
        }))
      ) {
        thisChannel.messages.fetch().then(messages => {
          messages.forEach(message => message.delete());
        });
      } else if (message.content === `${config.prefix}flush me`) {
        this["flush me"](message, client);
      } else if (message.content === `${config.prefix}flush all`) {
        this["flush all"](message, client);
      } else {
        message.reply(
          `${
            message.content
          } this command doesnt exist or channel's type is voice`
        );
      }
    } else {
      message.reply(`You have to enter admin mode`);
    }
    } else {
      message.reply('Deprecated');
    }
  }

  "flush all"(message, client) {
    this.setMuteRole(message);
    if (classes.Admin.mode === "admin") {
      message.channel.messages
        .fetch()
        .then(messages => messages.forEach(message => message.delete()));
    } else {
      message.reply(`You have to enter admin mode`);
    }
  }

  "flush me"(message, client) {
    this.setMuteRole(message);
    if (classes.Admin.mode === "admin") {
      message.channel.messages
        .fetch()
        .then(messages =>
          messages
            .array()
            .forEach(msg => message.author.equals(msg.author) && msg.delete())
        );
    } else {
      message.reply(`You have to enter admin mode`);
    }
  }

  async Tmute(message, client) {
    this.setMuteRole(message);
    if (classes.Admin.mode === "admin") {
      const user = message.mentions.users.first();
      if (user) {
        const member = message.guild.member(user);
        let reason =
          message.content.split(` <@${member.user.id}> `)[1] || "no reason";
        if (member) {
          this.users.set(member, new Map(member.roles));
          member.roles.set([this.mutedRole], reason);
          message.channel.send(`<@${member.user.id}> be a good boy next time`);
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
    if (classes.Admin.mode === "admin") {
      const user = message.mentions.users.first();
      if (user) {
        const member = message.guild.member(user);
        let reason =
          message.content.split(` <@${member.user.id}> `)[1] || "no reason";
        if (member) {
          member.roles.remove(this.mutedRole);
          this.users.get(member).forEach((role, index) => {
            if (role.name !== "@everyone") {
              member.roles.add(role, reason);
            }
          });
          message.channel.send(`<@${member.user.id}> good boy!`);
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
}

module.exports = AdminText;
