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
  if(msg.isMentioned(client.user)){
    replies.Greet(msg, client);
  }
  if (msg.content.startsWith(config.prefix) && msg.author.bot === false) {
    if (msg.content === `${config.prefix}ping`) {
      replies.Pong(msg);
    }
    if (msg.content === `${config.prefix}author`) {
      replies.Credits(msg);
    }
    if (msg.content === `${config.prefix}time`) {
      replies.Time(msg);
    }
    if (msg.content === "AYAYA") {
      replies.AYAYA(msg);
    }
    if (msg.content === `${config.prefix}help`) {
      replies.Help(msg);
    }
    if (isAuthor(msg)) {
      if (msg.content === `${config.prefix}disconnect`) {
        client.destroy();
      } else if (msg.content === `${config.prefix}restart`) {
        replies.Restart(msg);
        client.destroy();
        client.login(config.token).then(() => {
          replies.Start(msg);
        });
      } else if (msg.content === `${config.prefix}playtest`) {
        voice.Play(msg);
      }
    }
    if (isDj(msg) || isAuthor(msg)) {
      if (msg.content.includes(`${config.prefix}radio`)) {
        voice.Radio(msg);
      }
      if (
        msg.content.includes(`${config.prefix}play`) &&
        validateURL(msg.content.toLowerCase())
      ) {
        voice.Play(msg);
      } else if (
        msg.content.includes(`${config.prefix}stream`) &&
        validateURL(msg.content.toLowerCase())
      ) {
        voice.Stream(msg);
      } else if (msg.content === `${config.prefix}pause`) {
        voice.Pause(msg);
      } else if (msg.content === `${config.prefix}end` || msg.content === `${config.prefix}stop` ) {
        voice.End(msg);
      } else if (msg.content === `${config.prefix}resume`) {
        voice.Resume(msg);
      } else if (msg.content === `${config.prefix}join`) {
        voice.Join(msg);
      } else if (msg.content === `${config.prefix}leave`) {
        voice.Disconnect(msg);
      } else if (msg.content.includes(`${config.prefix}volume`)) {
        voice.changeVolume(msg);
      } else if (
        msg.content.includes(`${config.prefix}moveTo`) ||
        msg.content.includes(`${config.prefix}move`)
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
  let pattern = new RegExp(`${config.prefix}(play|stream) http.:[//]+www[.]youtube[.]com[/]watch.+`,"g");
  let check = pattern.test(msg);
  return check;
}
module.exports = { isAuthor, isDj, validateURL };
