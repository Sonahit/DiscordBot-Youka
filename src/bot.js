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
  if(msg.content.startsWith(`${config.prefix}`) && msg.author.bot === false ){
    let keyWord = msg.content.split(`${config.prefix}`)[1].split(' ')[0];
    let executor;
    commands.forEach((item, index) => {
      if(item.some((item,index )=> {
        return item === keyWord;
      }) === true) {
        executor = index;     
      }
    })
    if(executor){
      if( executor.constructor.name === 'AdminRights' && (validation.isRole(msg,'Модератор') || validation.isAuthor(msg))){
          executor[keyWord](msg, client);
        }
      else if (executor.constructor.name === 'Voice' && (validation.isRole(msg,'Модератор') || validation.isAuthor(msg))){
          executor[keyWord](msg, client);
        }
      else if (executor.constructor.name === 'Moving' && (validation.isRole(msg,'DJ') | validation.isRole(msg,'Модератор') | validation.isAuthor(msg))){
          executor[keyWord](msg, client);
        }
      else if (executor.constructor.name === 'Replies'){
          executor[keyWord](msg, client);
        }  
    } else {
      msg.reply(`${msg.content} command not found. Try to use !help`);
    }
  }
});
/*
const Replies = require("./actions/Replies");
const Voice = require("./actions/Voice.js");
const Moves = require("./actions/Moving");
const Admin = require("./actions/AdminRights");
const moving = new Moves();
const voice = new Voice();
const replies = new Replies();
const admin = new Admin();


console.log(config);

client.on("message", async msg => {
  logger.info(
    `"${msg.content}" sent by ${msg.author.username} at ${Date.now()}`
  );
  if (msg.isMentioned(client.user)) {
    replies.Greet(msg, client);
  }
  if (msg.content === "AYAYA" && msg.author.bot === false) {
    replies.AYAYA(msg);
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
   
    if (msg.content === `${config.prefix}help`) {
      replies.Help(msg);
    }
    
    if (validation.isAuthor(msg) > 0) {
      if (msg.content === `${config.prefix}disconnect`) {
        client.destroy();
      } 
      if (msg.content === `${config.prefix}restart`) {
        replies.Restart(msg);
        client.destroy();
        client.login(config.token).then(() => {
          replies.Start(msg);
        });
      } 
      if (msg.content === `${config.prefix}playtest`) {
        voice.Play(msg);
      }
    }
    if (validation.isRole(msg, "DJ") || validation.isAuthor(msg) > 0) {
      if (
        msg.content === `${config.prefix}follow me` ||
        msg.content === `${config.prefix}stop follow`
      ) {
        moving.Follow(msg);
      }
      if (msg.content.includes(`${config.prefix}radio`)) {
        voice.Radio(msg);
      }
      if (
        msg.content.includes(`${config.prefix}play`) &&
        validateURL(msg.content.toLowerelse if())
      ) {
        voice.Play(msg);
      } 
      if (
        msg.content.includes(`${config.prefix}stream`) &&
        validateURL(msg.content.toLowerelse if())
      ) {
        voice.Stream(msg);
      } 
      if (msg.content === `${config.prefix}pause`) {
        voice.Pause(msg);
      } 
      if (
        msg.content === `${config.prefix}end` ||
        msg.content === `${config.prefix}stop`
      ) {
        voice.End(msg);
      } 
      if (msg.content === `${config.prefix}resume`) {
        voice.Resume(msg);
      } 
      if (msg.content === `${config.prefix}join`) {
        voice.Join(msg);
      } 
      if (msg.content === `${config.prefix}leave`) {
        voice.Disconnect(msg);
      } 
      if (msg.content.includes(`${config.prefix}volume`)) {
        voice.changeVolume(msg);
      } 
      if (
        msg.content.includes(`${config.prefix}moveTo`) ||
        msg.content.includes(`${config.prefix}move`)
      ) {
        moving.Move(msg, client);
      }
    }
    if (validation.isRole(msg, "Модератор") || validation.isAuthor(msg) > 0) {
      if (
        msg.content.includes(`${config.prefix}kick`) &&
        admin.getMode() === "admin"
      ) {
        admin.Kick(msg);
      } 
      if (msg.content.includes(`${config.prefix}goAdmin`)) {
        admin.setMode("admin");
        msg.author.send(
          `I have entered into moderation mode be careful! ${
            msg.author.username
          }`
        );
      } 
      if (msg.content.includes(`${config.prefix}goUser`)) {
        admin.setMode("user");
        msg.author.send(`Exited moderation mode`);
      } 
      if (
        msg.content.includes(`${config.prefix}moveTo`) ||
        msg.content.includes(
          `${config.prefix}move` && msg.content !== `${config.prefix}move to me`
        )
      ) {
        admin.Move(msg, client);
      } 
      if (msg.content.includes(`${config.prefix}mute`)) {
        admin.Mute(msg);
      } 
      if (msg.content.includes(`${config.prefix}unmute`)) {
        admin.unMute(msg);
      }
    }
  }
});*/
