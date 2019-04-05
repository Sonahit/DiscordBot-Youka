const Discord = require('discord.js');
const client = new Discord.Client();
const logger = require('winston');
const config = require('../config/config');
const Voice = require("./actions/Voice.js");
const Replies = require("./actions/Replies");
require("opusscript");
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot

client.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.user.username + ' - (' + client.user.id + ')');
    console.log(`Connected via ${client.user.username}`);
});

client.login(config.token);

client.on('message', msg => {
    logger.info(`Sent by ${msg.author}`)
    if (msg.content === '!ping') {
      Replies.prototype.Pong(msg);
    }
    if (msg.content === '!time') {
      Replies.prototype.Time(msg);
    }
    if (msg.content === 'AYAYA' && msg.author.bot === false) {
      Replies.prototype.AYAYA(msg);
    }
    if (msg.content === '!help') {
      Replies.prototype.Help(msg);
    }
    if (isAuthor(msg))  {
      if( msg.content === '!disconnect' ){  
        client.destroy();
      } else if(msg.content === '!restart'){
        Replies.prototype.Restart(msg);
        client.destroy();
        client.login(config.token).then( () => {
          Replies.prototype.Start(msg);
        });
      } else if (msg.content === '!playtest') {
          Voice.prototype.Play(msg);
        }
    }
    if(isDj(msg)){
      if (msg.content.substring(0,5) === '!play' ) {
        Voice.prototype.Play(msg);
      }
      if (msg.content.substring(0,7) === '!stream' ) {
        Voice.prototype.Play(msg);
      }
      if (msg.content === '!pause') {
        Voice.prototype.Pause(msg);
      }
      if (msg.content === '!end') {
        Voice.prototype.End(msg);
      }
      if (msg.content === '!resume') {
        Voice.prototype.Resume(msg);
      }
      if(msg.content === "!join"){
        Voice.prototype.Join(msg);
      }
      if(msg.content === "!leave"){
        Voice.prototype.Disconnect(msg);
      }
      if(msg.content.includes("!volume")){
        Voice.prototype.changeVolume(msg);
      }
    }
});

function isAuthor(msg){
  return msg.author.client.user.username.indexOf(config.owners) 
  && msg.author.client.user.discriminator.indexOf(config.owners)
}

function isDj(msg){
  return msg.author.client.user.username.indexOf(config.djs) 
  && msg.author.client.user.discriminator.indexOf(config.djs)
}
