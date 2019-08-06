const commonRights = require("./utils/Constants").commonRights;

module.exports = class Validation {
  constructor() {
    this.config = require("../config/config.js");
    // eslint-disable-next-line no-unused-vars
  }

  isWhitelisted(author) {
    return this.config.whitelist.some(user => {
      return (
        (author.username === user.username &&
          author.discriminator === user.discriminator) ||
        author.id === user.id
      );
    });
  }

  isBlacklisted(author) {
    return this.config.blacklist.some(user => {
      return (
        (user.discriminator === author.discriminator &&
          user.username === author.username) ||
        user.id === author.id
      );
    });
  }

  addToBlacklist(msg) {
    return new Promise((resolve, reject) => {
      const author = msg.guild.member(msg.mentions.users.first()).user;
      if (!this.isBlacklisted(author)) {
        this.config.blacklist.push(
          (author.username = {
            username: author.username,
            discriminator: author.discriminator,
            id: author.id
          })
        );
        let index = this.config.whitelist.findIndex(user => {
          return user.id === author.id;
        });
        if (index >= 0) {
          this.config.whitelist.splice(index, 1);
        }
        resolve(author);
      } else {
        reject({
          message: "Couldn't add to blacklist"
        });
      }
    });
  }

  addToWhitelist(msg) {
    return new Promise((resolve, reject) => {
      const author = msg.guild.member(msg.mentions.users.first()).user;
      if (!this.isWhitelisted(author)) {
        this.config.whitelist.push(
          (author.username = {
            username: author.username,
            discriminator: author.discriminator,
            id: author.id
          })
        );
        let index = this.config.blacklist.findIndex(user => {
          return user.id === author.id;
        });
        if (index >= 0) {
          this.config.blacklist.splice(index, 1);
        }
        resolve(author);
      } else {
        reject({ message: "Couldn't add to whitelist" });
      }
    });
  }

  /**
   * Check if incoming role is valid to do an command
   * @param {*} msg
   */
  hasPermission(msg, roles = commonRights) {
    if (this.isWhitelisted(msg.author)) {
      return true;
    }
    if (msg.content === `${this.config.prefix}help`) {
      return true;
    }
    if (msg.member == null) {
      return false;
    }
    if (!Array.isArray(roles)) {
      return msg.member.roles.some(userRole => {
        if (userRole.name) {
          userRole = this.roleToString(userRole.name);
          return roles === userRole;
        }
      });
    }
    return msg.member.roles.some(userRole => {
      if (userRole.name) {
        userRole = this.roleToString(userRole.name);
        return roles.some(role => {
          return role === userRole;
        });
      }
    });
  }
  roleToString(role) {
    const emojiSplitter = require("emoji-aware");
    return emojiSplitter
      .withoutEmoji(role)
      .reduce((accum, char) => {
        if (char !== ",") {
          return accum.concat(char);
        }
      }, "")
      .trim();
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
};
