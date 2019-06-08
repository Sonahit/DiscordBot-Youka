const client = require("./utils/Client");
const logger = require("winston");
require("opusscript");
const commands = require("./utils/commands");
const validation = new global.Validation();
const replies = new global.Replies();
const config = validation.config;
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true
});
logger.level = "debug";

// Initialize Discord Bot

client.on("ready", () => {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(client.user.username + " - (" + client.user.id + ")");
  console.log(`Connected via ${client.user.username}`);
  client.user.setPresence({
    activity: { name: "With pleasure", type: "PLAYING" },
    status: "online"
  });
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
      msg.content === "AYAYA" &&
      validation.hasPermission(msg) &&
      msg.author.bot === false
    ) {
      replies.AYAYA(msg);
    }
    if (msg.content.startsWith(config.prefix) && msg.author.bot === false) {
      if (validation.hasPermission(msg)) {
        const keyWord = msg.content.split(`${config.prefix}`)[1].split(" ")[0];
        let executor;
        commands.forEach((command, name) => {
          if (
            command.some(content => {
              return content === keyWord;
            }) === true
          ) {
            executor = name;
          }
        });
        switch (executor) {
          case "AdminRights": {
            if (
              validation.hasPermission(msg, "Модератор") ||
              validation.isAuthor(msg)
            ) {
              const adminRights = new global.AdminRights();

              adminRights[keyWord](msg, client);
            }
            break;
          }
          case "Voice": {
            if (
              validation.hasPermission(msg, "DJ") ||
              validation.isAuthor(msg)
            ) {
              const voice = new global.Voice();

              voice[keyWord](msg, client);
            }
            break;
          }
          case "Moving": {
            if (
              validation.hasPermission(msg, "DJ") ||
              validation.isAuthor(msg)
            ) {
              const moving = new global.Moving();
              moving[keyWord](msg, client);
            }
            break;
          }
          case "Replies": {
            replies[keyWord](msg, client);
            break;
          }
          default: {
            msg.reply(
              `${msg.content} command not found. Try to use ${
                config.prefix
              }help`
            );
          }
        }
      } else {
        replies.Error(msg);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
});

client.on("error", error => {
  console.log(error);
});
