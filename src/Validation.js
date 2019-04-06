module.exports = class Validation {
  constructor() {
    this.config = require("../config/config.js");
  }
  isAuthor(msg) {
    return (
      msg.author.username.indexOf(this.config.owners) &&
      msg.author.discriminator.indexOf(this.config.owners)
    );
  }

  isRole(msg, role) {
    let check = false;
    let typingCheck = msg.member;
    if (typingCheck != null) {
      if (this.config.Priority.includes(role)) {
        return true;
      }
      check = msg.member.roles.some(function(item, i, array) {
        return item.name === role;
      });
      return check;
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
};
