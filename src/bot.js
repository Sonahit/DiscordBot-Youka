const Discord = require("discord.js");
const client = new Discord.Client();
const logger = require("winston");
const config = require("../config/config");
require("opusscript");
const Replies = require("./actions/Replies");
const replies = new Replies();
const Validation = require("./Validation");
const validation = new Validation();
// #TODO Make a map of commands
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true
});
logger.level = "debug";
// Initialize Discord Bot
const commands = require("./utils/commands");
client.on("ready", () => {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(client.user.username + " - (" + client.user.id + ")");
  console.log(`Connected via ${client.user.username}`);
});

client.login(config.token);

client.on("message", async msg => {
  logger.info(
    `"${msg.content}" sent by ${msg.author.username} at ${Date.now()}`
  );
  if (msg.isMentioned(client.user) && msg.author.bot === false) {
    replies.Greet(msg, client);
  }
  if (msg.content === "AYAYA" && msg.author.bot === false) {
    replies.AYAYA(msg);
  }
  if (msg.content.startsWith(`${config.prefix}`) && msg.author.bot === false) {
    let keyWord = msg.content.split(`${config.prefix}`)[1].split(" ")[0];
    let executor;
    commands.forEach((item, index) => {
      if (
        item.some((item, index) => {
          return item === keyWord;
        }) === true
      ) {
        executor = index;
      }
    });
    if (executor) {
      if (
        executor.constructor.name === "AdminRights" &&
        (validation.isRole(msg, "Модератор") || validation.isAuthor(msg))
      ) {
        executor[keyWord](msg, client);
      } else if (
        executor.constructor.name === "Voice" &&
        (validation.isRole(msg, "Модератор") || validation.isAuthor(msg))
      ) {
        executor[keyWord](msg, client);
      } else if (
        executor.constructor.name === "Moving" &&
        validation.isRole(msg, "DJ") |
          validation.isRole(msg, "Модератор") |
          validation.isAuthor(msg)
      ) {
        executor[keyWord](msg, client);
      } else if (executor.constructor.name === "Replies") {
        executor[keyWord](msg, client);
      }
    } else {
      msg.reply(`${msg.content} command not found. Try to use !help`);
    }
  }
});
