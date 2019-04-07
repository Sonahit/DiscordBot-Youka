module.exports = class Validation {
  constructor() {
    this.config = require("../config/config.js");
  }
  isAuthor(msg) {
    return this.config.owners.some((item, index) => {
      return msg.author.username === item.username &&
              msg.author.discriminator === item.id
    })
  }

  isRole(msg, role) {
    let typingCheck = msg.member;
    if (typingCheck != null) {
      if (this.config.Priority.includes(role)) {
        return true;
      }
      msg.member.roles.some(function(item, i, array) {
        if(item.name === role){
          return true
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

  checkBotMove(msg = "") {
    // let pattern = /!(move|moveTo)\s\d+/g
    let pattern = new RegExp(`${this.config.prefix}(move|moveTo) *[0-9]+`, "g");
    let check = pattern.test(msg);
    return check;
  }
  checkMoveUser(msg = "") {
    let pattern = /!(move|moveTo)(\s*(\w|[А-Яа-я])+\s[0-9]*)/g;
    //let pattern = new RegExp(`${config.prefix}(move|moveTo) *(\w|[А-Яа-я])+ [0-9]+`,'g')
    let check = pattern.test(msg);
    return check;
  }
  clearEmbed(embed){
    embed.setAuthor("");
    embed.setColor("");
    embed.setDescription("");
    embed.setFooter("");
    embed.setImage("");
    embed.setThumbnail("");
    embed.setTimestamp("");
    embed.setTitle("");
    embed.setURL("");
    while (embed.fields.length > 0){
      embed.fields.shift();
    }
    return embed;
  }
};
