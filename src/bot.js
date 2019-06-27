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
        commands.forEach((command, emitter) => {
          const validate = command.some(content => {
            return content === keyWord;
          });
          if (validate) {
            executeCommand(emitter, keyWord, msg);
          }
        });
      } else {
        replies.Error(msg);
      }
    }
  } catch (err) {
    console.error(err);
  }
});

client.on("error", error => {
  console.log(error);
});

const executeCommand = (emitter, command, msg) => {
  const executor = {
    AdminRights: function(emitter, command) {
      if (validation.hasPermission(msg, config.ModeratorPermission)) {
        emitter[command](msg, client);
      } else {
        replies["Error"](msg, client);
      }
    },
    Voice: function(emitter, command) {
      if (validation.hasPermission(msg, config.DJPermission)) {
        emitter[command](msg, client);
      } else {
        replies["Error"](msg, client);
      }
    },
    Moving: function(emitter, command) {
      if (validation.hasPermission(msg, config.DJPermission)) {
        emitter[command](msg, client);
      } else {
        replies["Error"](msg, client);
      }
    },
    Replies: function(emitter, command) {
      emitter[command](msg, client);
    }
  };
  executor[emitter.constructor.name](emitter, command);
  console.log(
    `${msg.author.username} executed ${
      emitter.constructor.name
    } ---> ${command}`
  );
};
