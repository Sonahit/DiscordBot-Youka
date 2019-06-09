const client = require("./utils/Client");
const logger = require("winston");
require("opusscript");
const commands = require("./utils/commands");
const validation = global.Validation;
const replies = global.Replies;
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
        commands.forEach((command, emitterName) => {
          const validate = command.some(content => {
            return content === keyWord;
          });
          if (validate) {
            executeCommand(emitterName, keyWord, msg);
          }
        });
      } else {
        replies.Error(msg);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
});

const executeCommand = (emitter, command, msg) => {
  const executor = {
    AdminRights: function(command) {
      if (validation.hasPermission(msg, config.ModeratorPermission)) {
        const adminRights = global.AdminRights;
        adminRights[command](msg, client);
        return true;
      }
      return false;
    },
    Voice: function(command) {
      if (validation.hasPermission(msg, config.DJPermission)) {
        const voice = global.Voice;
        voice[command](msg, client);
        return true;
      }
      return false;
    },
    Moving: function(command) {
      if (validation.hasPermission(msg, config.DJPermission)) {
        const moving = global.Moving;
        moving[command](msg, client);
        return true;
      }
      return false;
    },
    Replies: function(command) {
      replies[command](msg, client);
      return true;
    }
  };
  executor[emitter](command);
  console.log(`${msg.author.username} executed ${emitter} ---> ${command}`);
};

client.on("error", error => {
  console.log(error);
});
