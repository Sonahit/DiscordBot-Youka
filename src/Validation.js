module.exports = class Validation {
  constructor() {
    this.config = require("../config/config.js");
  }
  
  isAuthor(msg) {
    return this.config.owners.some((item, index) => {
      return (
        msg.author.username === item.username &&
        msg.author.discriminator === item.id
      );
    });
  }

  /**
   * Check if incoming role is valid to do an command
   * @param {*} msg 
   * @param {*} role 
   */
  isRole(msg, role) {
    let typingCheck = msg.member;
    if (typingCheck != null) {
      if (this.config.Priority.includes(role) && msg.member.roles.forEach((item, index)=> {
        return role === item.name;
      })) {
        return true;
      }
      msg.member.roles.some(function(item, i, array) {
        if (item.name === role) {
          return true;
        }
      });
    } else {
      msg.author.send("Try to type from channel");
    }
  }

  validateURL(msg) {
    let pattern = new RegExp(
      `${
        this.config.prefix
      }(play|stream) http.:[//]+www[.]youtube[.]com[/]watch.+`,
      "g"
    );
    let check = pattern.test(msg);
    return check;
  }

  /**
   * Checking if command is valid to move a bot
   * check ${this.config.prefix}help on running bot
   * @param {*} msg 
   */
  checkBotMove(msg = "") {
    // let pattern = /!(move|moveTo)\s\d+/g
    let pattern = new RegExp(`${this.config.prefix}(move|moveTo) *[0-9]+`, "g");
    let check = pattern.test(msg);
    return check;
  }

  /**
   * Checking if command is valid to move a user
   * check ${this.config.prefix}help on running bot
   * @param {*} msg 
   */
  checkMoveUser(msg = "") {
    let pattern = /!(move|moveTo)(\s*(\w|[А-Яа-я])+\s[0-9]*)/g;
    //let pattern = new RegExp(`${config.prefix}(move|moveTo) *(\w|[А-Яа-я])+ [0-9]+`,'g')
    let check = pattern.test(msg);
    return check;
  }
  /**
   * 
   * @param {*} embed 
   */
  clearEmbed(embed) {
    embed.setAuthor("");
    embed.setColor("");
    embed.setDescription("");
    embed.setFooter("");
    embed.setImage("");
    embed.setThumbnail("");
    embed.setTimestamp("");
    embed.setTitle("");
    embed.setURL("");
    while (embed.fields.length > 0) {
      embed.fields.shift();
    }
    return embed;
  }
};
