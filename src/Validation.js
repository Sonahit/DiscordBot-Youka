module.exports = class Validation {
  constructor() {
    this.config = require("../config/config.js");
  }

  isAuthor(msg) {
    return this.config.owners.some(item => {
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
  hasPermission(msg, roles = this.config.ValidRoles) {
    if (msg.content === `${this.config.prefix}help`) {
      return true;
    }
    if (msg.member == null) {
      return false;
    }
    if (!Array.isArray(roles)) {
      return msg.member.roles.some(item => {
        return roles === item.name;
      });
    }
    return msg.member.roles.some(item => {
      return roles.some(role => {
        return role === item.name;
      });
    });
  }

  validateURL(msg) {
    return new RegExp(
      `${
        this.config.prefix
      }(play|stream) http.:[//]+www[.]youtube[.]com[/]watch.+`,
      "g"
    ).test(msg);
  }

  /**
   * Checking if command is valid to move a bot
   * check ${this.config.prefix}help on running bot
   * @param {*} msg
   */
  checkBotMove(msg = "") {
    return new RegExp(`${this.config.prefix}(move|moveTo)\\s*[0-9]+`, "g").test(
      msg
    );
  }

  greetMessage(msg) {
    return (
      /^(?!\W.*$).*(g?h?w?)(reetings|hat's up|ello|ola|ey|azzup|hi)(!?)/gi.test(
        msg
      ) ||
      /^(?![><!"№;%:?*()@#$^&?/.'"\]}{,|`~+\-[].*$).*(привет)|(^[з]|дравствуй[те]?|драсти$)|^(дар(ова|оу))|([х](ай|еллоу))(!?)/gi.test(
        msg
      )
    );
  }
  /**
   * Checking if command is valid to move a user
   * check ${this.config.prefix}help on running bot
   * @param {*} msg
   */
  checkMoveUser(msg = "") {
    //let pattern = /!(move|moveTo)(\s*(\w|[А-Яа-я])+\s[0-9]*)/g;
    return new RegExp(
      `${this.config.prefix}move\\s*(\\w|[А-Яа-я])+\\s[0-9]+`,
      "g"
    ).test(msg);
  }

  addPriority() {}
  addValidRole() {}
};
