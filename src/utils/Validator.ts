import { YUser } from "yooka-bot";
import { User, Message, UserResolvable, Role } from "discord.js";
import config from "../../config/config";
import { ValidationHandler } from "typings";
const emojiSplitter = require("emoji-aware");

class Validator implements ValidationHandler {
  isWhiteListed(author: User) {
    return config.whitelist.some((user: YUser) => {
      return (author.username === user.username && author.discriminator === user.discriminator) || author.id === user.id;
    });
  }

  isBlackListed(author: User) {
    return config.blacklist.some((user: YUser) => {
      return (user.discriminator === author.discriminator && user.username === author.username) || user.id === author.id;
    });
  }

  addToBlackList(msg: Message) {
    return new Promise((resolve, reject) => {
      const mentioned = msg.mentions.users.first() as UserResolvable;
      const author = msg.guild!.member(mentioned)!.user;
      if (!this.isBlackListed(author)) {
        config.blacklist.push({
          username: author.username,
          discriminator: author.discriminator,
          id: author.id
        });
        let index = config.whitelist.findIndex((user: YUser) => {
          return user.id === author.id;
        });
        if (index >= 0) {
          config.whitelist.splice(index, 1);
        }
        resolve(author);
      } else {
        reject({
          message: "Couldn't add to blacklist"
        });
      }
    });
  }

  addToWhiteList(msg: Message) {
    return new Promise((resolve, reject) => {
      const mentioned = msg.mentions.users.first() as UserResolvable;
      const author = msg.guild!.member(mentioned)!.user;
      if (!this.isWhiteListed(author)) {
        config.whitelist.push({
          username: author.username,
          discriminator: author.discriminator,
          id: author.id
        });
        let index = config.blacklist.findIndex((user: YUser) => {
          return user.id === author.id;
        });
        if (index >= 0) {
          config.blacklist.splice(index, 1);
        }
        resolve(author);
      } else {
        reject({ message: "Couldn't add to whitelist" });
      }
    });
  }

  /**
   * Check if incoming role is valid to do an command
   * @param msg incoming message
   * @param roles incoming permissions
   */
  hasPermission(msg: Message, roles = global.permissions.common) {
    if (this.isWhiteListed(msg.author)) {
      return true;
    }
    if (msg.content === `${config.prefix}help`) {
      return true;
    }
    if (msg.member == null) {
      return false;
    }
    if (!Array.isArray(roles)) {
      return msg.member.roles.some(userRole => {
        if (userRole.name) {
          userRole = this.roleWithoutEmoji(userRole.name);
          return roles === userRole;
        }
        return false;
      });
    }
    return msg.member.roles.some(userRole => {
      if (userRole.name) {
        const userRoleName = this.roleWithoutEmoji(userRole.name);
        return roles.some(role => {
          return role === userRoleName;
        });
      }
      return false;
    });
  }

  roleWithoutEmoji(role: string) {
    return emojiSplitter
      .withoutEmoji(role)
      .reduce((accum: string, char: string) => {
        if (char !== ",") {
          return accum.concat(char);
        }
      }, "")
      .trim();
  }

  validateURL(url: string) {
    return new RegExp(`${config.prefix}(play|stream) http.:[//]+www[.]youtube[.]com[/]watch.+`, "g").test(url);
  }

  /**
   * Checking if command is valid to move a bot
   * check ${config.prefix}help on running bot
   * @param {string} msg
   */
  checkBotMove(command: string) {
    return new RegExp(`${config.prefix}(move|moveTo)\\s*[0-9]+`, "g").test(command);
  }
  greetMessage(msg: string) {
    return (
      /^(?!\W.*$).*(g?h?w?)(reetings|hat's up|ello|ola|ey|azzup|hi)(!?)/gi.test(msg) ||
      /^(?![><!"№;%:?*()@#$^&?/.'"\]}{,|`~+\-[].*$).*(привет)|(^[з]|дравствуй[те]?|драсти$)|^(дар(ова|оу))|([х](ай|еллоу))(!?)/gi.test(msg)
    );
  }
  /**
   * Checking if command is valid to move a user
   * check ${config.prefix}help on running bot
   * @param {*} msg
   */
  checkMoveUser(msg = "") {
    //let pattern = /!(move|moveTo)(\s*(\w|[А-Яа-я])+\s[0-9]*)/g;
    return new RegExp(`${config.prefix}move\\s*(\\w|[А-Яа-я])+\\s[0-9]+`, "g").test(msg);
  }
}

export default Validator;
