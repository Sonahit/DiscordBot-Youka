const Discord = require("discord.js");
const client = new Discord.Client();
const logger = require("winston");
const config = require("../config/config");
require("opusscript");

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
});

client.login(config.token);

const Voice = require("./actions/Voice.js");
const Moves = require("./actions/Moving");
const moving = new Moves();
const voice = new Voice();
const Replies = require("./actions/Replies");
const replies = new Replies();

client.on("message", async msg => {
  logger.info(
    `"${msg.content}" sent by ${msg.author.username} at ${Date.now()}`
  );
  if (msg.content.startsWith("!") && msg.author.bot === false) {
    if (msg.content === "!ping") {
      replies.Pong(msg);
    }
    if (msg.content === "!time") {
      replies.Time(msg);
    }
    if (msg.content === "AYAYA") {
      replies.AYAYA(msg);
    }
    if (msg.content === "!help") {
      replies.Help(msg);
    }
    if (isAuthor(msg)) {
      if (msg.content === "!disconnect") {
        client.destroy();
      } else if (msg.content === "!restart") {
        replies.Restart(msg);
        client.destroy();
        client.login(config.token).then(() => {
          replies.Start(msg);
        });
      } else if (msg.content === "!playtest") {
        voice.Play(msg);
      }
    }
    if (isDj(msg) || isAuthor(msg)) {
      if (msg.content.includes("!radio")) {
        voice.Radio(msg);
      }
      if (
        msg.content.includes("!play") &&
        validateURL(msg.content.toLowerCase())
      ) {
        voice.Play(msg);
      } else if (
        msg.content.includes("!stream") &&
        validateURL(msg.content.toLowerCase())
      ) {
        voice.Stream(msg);
      } else if (msg.content === "!pause") {
        voice.Pause(msg);
      } else if (msg.content === "!end") {
        voice.End(msg);
      } else if (msg.content === "!resume") {
        voice.Resume(msg);
      } else if (msg.content === "!join") {
        voice.Join(msg);
      } else if (msg.content === "!leave") {
        voice.Disconnect(msg);
      } else if (msg.content.includes("!volume")) {
        voice.changeVolume(msg);
      } else if (
        msg.content.includes("!moveTo") ||
        msg.content.includes("!move")
      ) {
        moving.Move(msg, client);
      }
    }
  }
});

function isAuthor(msg) {
  return (
    msg.author.client.user.username.indexOf(config.owners) &&
    msg.author.client.user.discriminator.indexOf(config.owners)
  );
}

function isDj(msg) {
  let check = false;
  let typingCheck = msg.member;
  if (typingCheck != null) {
    for (value of msg.member.roles.values()) {
      if (value.name === "DJ") {
        check = true;
        break;
      }
    }
    return check;
  } else {
    msg.author.send("Try to type from channel");
  }
}

function validateURL(msg) {
  let pattern = /!(play|stream)\s*http.:[//]+www[.]youtube[.]com[/]watch.+/gi;
  let check = pattern.test(msg);
  return check;
}
module.exports = { isAuthor, isDj, validateURL };
