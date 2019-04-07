const client = require("./utils/Client");
const logger = require("winston");
require("opusscript");

const Replies = require("./actions/Replies");
const replies = new Replies();
const Validation = require("./Validation");
const validation = new Validation();

const config = validation.config;

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
  client.user.setActivity(name = "with pleasure",{
    url: "https://www.twitch.tv/monstercat",
    type: "STREAMING"
  });
  client.user.setStatus("online");
});

client.login(config.token);

/*
 * Handling incoming messages
 * If started with command prefix
 * if exists and valid make an execution of command
 */
client.on("message", async msg => {
  try {
    logger.info(
      `"${msg.content}" sent by ${msg.author.username} at ${Date.now()}`
    );
    if (
      msg.isMentioned(client.user) &&
      msg.author.bot === false &&
      msg.content === `<@${client.user.id}>`
    ) {
      replies.Greet(msg, client);
    }
    if (msg.content === "AYAYA" && validation.isRole(msg)   && msg.author.bot === false) {
      replies.AYAYA(msg);
    }
    if (validation.greetMessage(msg.content) && validation.isRole(msg) && msg.author.bot === false) {
      replies.onHello(msg, client);
    }
    if (
      msg.content.startsWith(`${config.prefix}`) &&
      msg.author.bot === false
    ) { 
      if( validation.isRole(msg) ){
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
                (validation.isRole(msg, "DJ") || validation.isAuthor(msg))
              ) {
                executor[keyWord](msg, client);
              } else if (
                executor.constructor.name === "Text" &&
                (validation.isRole(msg, "Модератор") || validation.isAuthor(msg))
              ) {
                executor[keyWord](msg, client);
              } else if (
                (executor.constructor.name === "Moving" &&
                  validation.isRole(msg, "DJ")) ||
                validation.isAuthor(msg)
              ) {
                executor[keyWord](msg, client);
              } else if (executor.constructor.name === "Replies") {
                executor[keyWord](msg, client);
              }
            } else {
              msg.reply(`${msg.content} command not found. Try to use !help`);
            }
      } else {
        replies.Error(msg);
      }
    }
  } catch (err) {
    console.log(err);
  }
});