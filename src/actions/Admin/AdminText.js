/* eslint-disable no-undef */
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

  async Tmute(msg) {
    this.setMuteRole(msg);
    if (classes.Admin.mode === "admin") {
      const user = msg.mentions.users.first();
      if (user) {
        const member = msg.guild.member(user);
        let reason =
          msg.content.split(` <@${member.user.id}> `)[1] || "no reason";
        if (member) {
          this.users.set(member, new Map(member.roles));
          member.roles.set([this.mutedRole], reason);
          msg.channel.send(`<@${member.user.id}> be a good boy next time`);
        } else {
          msg.reply("You didn't mention the user to mute at textchannels!");
        }
      } else {
        msg.reply("That user isn't in this guild!");
      }
    } else {
      msg.reply(`You have to enter admin mode`);
    }
  }

  Tunmute(msg) {
    this.setMuteRole(msg);
    if (classes.Admin.mode === "admin") {
      const user = msg.mentions.users.first();
      if (user) {
        const member = msg.guild.member(user);
        let reason =
          msg.content.split(` <@${member.user.id}> `)[1] || "no reason";
        if (member) {
          member.roles.remove(this.mutedRole);
          this.users.get(member).forEach(role => {
            if (role.name !== "@everyone") {
              member.roles.add(role, reason);
            }
          });
          msg.channel.send(`<@${member.user.id}> good boy!`);
          this.users.delete(member);
        } else {
          msg.reply("You didn't mention the user to mute at textchannels!");
        }
      } else {
        msg.reply("That user isn't in this guild!");
      }
    } else {
      msg.reply(`You have to enter admin mode`);
    }
  }
  setMuteRole(msg) {
    const serverRoles = msg.guild.roles;
    serverRoles.forEach(item => {
      if (item.name === "Muted") {
        this.mutedRole = item;
      }
    });
  }
}

module.exports = AdminText;
