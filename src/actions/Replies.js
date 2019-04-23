const { MessageAttachment } = require("discord.js");
const Discord = require("discord.js");
let embed = new Discord.MessageEmbed();
const Validation = require("../Validation");
const validation = new Validation();
const config = validation.config;

class Replies {
  Greet(msg, client) {
    embed = validation.clearEmbed(embed);
    embed.setColor("0xfafa33");
    embed.setAuthor(`${client.user.username}`);
    embed.setThumbnail(
      `https://pbs.twimg.com/profile_images/1040094061057650688/wNO6rNzn_400x400.jpg`
    );
    embed.setDescription(
      `Hello${config.prefix} If you need any help type ${config.prefix}help`
    );
    msg.reply(embed);
  }
  onHello(msg, client) {
    msg.channel.send(`Rise and shine <@${msg.author.id}>`);
  }
  author(msg, client) {
    embed = validation.clearEmbed(embed);
    embed.setColor("0xffffff");
    embed.setAuthor(`@IvanSadykov`);
    embed.setThumbnail(
      `https://pmcvariety.files.wordpress.com/2018/05/discord-logo.jpg?w=1000&h=563&crop=1`
    );
    embed.setDescription(
      `Hello ${msg.author.username}! I am author of this bot. If you have any suggestions please contact me at github or via email.`
    );
    embed.addField("GitHub", "https://github.com/Sonahit/");
    embed.addField("Gmail", "grandpajok@gmail.com");
    embed.addBlankField();
    embed.setFooter(
      "Sincerely @IvanSadykov",
      `https://media.discordapp.net/attachments/563442639265988641/563908892262662144/AYAYA.png`
    );
    msg.author.send(embed);
  }
  ping(msg) {
    msg.reply("Pong${config.prefix} :D");
  }
  Error(msg) {
    embed = validation.clearEmbed(embed);
    embed.setAuthor(
      "Validator",
      "https://cdn.pixabay.com/photo/2012/04/15/19/12/cross-34976_960_720.png"
    );
    embed.setTitle("Error 403");
    embed.setDescription(`You don't have any right <@${msg.author.id}>`);
    embed.addField(
      "What to do?",
      "PM any online moderators and ask for role Krabik"
    );
    embed.addField("What next?", "Just wait for their response");
    embed.addBlankField();
    embed.addField(
      "What can i do right now?",
      `You can join any voice channels but your microphone will be switched to "onPush"`
    );
    embed.setFooter(
      "Sincerely your validator!",
      "http://i0.kym-cdn.com/photos/images/facebook/001/290/938/4a7.jpg"
    );
    msg.author.send(embed);
  }
  async help(msg) {
    embed = validation.clearEmbed(embed);
    const attachment = new MessageAttachment(
      "https://discordemoji.com/assets/emoji/AYAYA.png"
    );
    const cry = ":cry:";
    await msg.author.send(attachment);
    embed.setTitle("Help");
    embed.setFooter(
      `Requested by ${msg.author.username}`,
      `${msg.author.avatarURL() || "https://i.redd.it/1cp6bf2ahaky.jpg"} `
    );
    embed.fields.push(
      {
        name: ` You said you need ?HELP?`,
        value: `${cry.repeat(8)}`
      },
      {
        name: `Available commands:`,
        value: ` AYAYA:\tAYAYA                         
                \`${config.prefix}ping\`:\tTypes a reply pong 
                \`${config.prefix}time\`:\tShows local time of bot
                \`${config.prefix}help\`:\tGet help`
      }
    );
    if (validation.isAuthor(msg) > 0) {
      embed.fields.push({
        name: `For DJs:`,
        value: `\`${config.prefix}play https://[url]\`:\tPlays a video 
                \`${config.prefix}join\`:\tJoins your channel 
                \`${config.prefix}leave\`:\tLeaves your channel 
                \`${config.prefix}radio\`:\tPlays a radio  
                \`${config.prefix}pause\`:\tPause playing video 
                \`${config.prefix}resume\`:\tResumes playing video 
                \`${config.prefix}end\`:\tEnds playing video 
                \`${config.prefix}volume 0-200\`:\tChanges volume from 0 to 200
                \`${config.prefix}moveTo \`:\tGet all channels and their ids
                \`${config.prefix}moveTo #\`:\tMoving bot to # Channel
                \`${config.prefix}moveTo me\`:\tMoves bot to you
                \`${config.prefix}follow me\`:\tFollows you 
                \`${config.prefix}follow me\`:\tBot is following you 
                \`${config.prefix}follow (@username)\`:\tBot is following (@username) 
                \`${config.prefix}follow stop\`:\tStop following you `
      });
      embed.fields.push({
        name: `For Admins:`,
        value: ` 
                \`${config.prefix}IAdmin\`:\tSet admin mode 
                \`${config.prefix}IUser\`:\tSet user mode 
                \`${config.prefix}disconnect\`:\tShutdowns bot  
                \`${config.prefix}restart\`:\tRestarts bot
                \`${config.prefix}move {name} #\`:\tMoving {name} to # Channel
                \`${config.prefix}flush\`:\tDeletes bot's messages in his sight
                \`${
                  config.prefix
                }flush (channel Name) \`:\tDeletes bot's (channel name) messages in his sight
                \`${
                  config.prefix
                }flush all\`:\tDeletes all messages  in bot's sight  
                \`${
                  config.prefix
                }flush me\`:\tDeletes your messages in bot's sight  
                \`${
                  config.prefix
                }[un]mute (name) [reason]\`:\t[un]Mute voice of (name) with a [reason]
                \`${
                  config.prefix
                }[un]Tmute (name) [reason]\`:\t[un]Mute text of (name) with a [reason]`
      });
      embed.setColor("0xff8040");
      msg.author.send(embed);
      return;
    }
    if (validation.isRole(msg, "Модератор")) {
      embed.fields.push({
        name: `For DJs:`,
        value: `\`${config.prefix}play https://[url]\`:\tPlays a video 
                \`${config.prefix}join\`:\tJoins your channel 
                \`${config.prefix}leave\`:\tLeaves your channel 
                \`${config.prefix}radio\`:\tPlays a radio  
                \`${config.prefix}pause\`:\tPause playing video 
                \`${config.prefix}resume\`:\tResumes playing video 
                \`${config.prefix}end\`:\tEnds playing video 
                \`${config.prefix}volume 0-200\`:\tChanges volume from 0 to 200
                \`${config.prefix}moveTo \`:\tGet all channels and their ids
                \`${config.prefix}moveTo #\`:\tMoving bot to # Channel
                \`${config.prefix}moveTo me\`:\tMoves bot to you
                \`${config.prefix}follow me\`:\tFollows you 
                \`${config.prefix}follow me\`:\tBot is following you 
                \`${config.prefix}follow (@username)\`:\tBot is following (@username) 
                \`${config.prefix}follow stop\`:\tStop following you `
      });
      embed.fields.push({
        name: `For Admins:`,
        value: ` 
                \`${config.prefix}IAdmin\`:\tSet admin mode 
                \`${config.prefix}IUser\`:\tSet user mode 
                \`${config.prefix}disconnect\`:\tShutdowns bot  
                \`${config.prefix}restart\`:\tRestarts bot
                \`${config.prefix}move name #\`:\tMoving {name} to # Channel
                \`${config.prefix}flush\`:\tDeletes bot's messages in his sight
                \`${
                  config.prefix
                }flush (channel Name) \`:\tDeletes bot's (channel name) messages in his sight
                \`${
                  config.prefix
                }flush all\`:\tDeletes all messages  in bot's sight  
                \`${
                  config.prefix
                }flush me\`:\tDeletes your messages in bot's sight  
                \`${
                  config.prefix
                }[un]mute (name) [reason]\`:\t[un]Mute voice of (name) with a [reason]
                \`${
                  config.prefix
                }[un]Tmute (name) [reason]\`:\t[un]Mute text of (name) with a [reason]`
      });
      embed.setColor("0xff8040");
      msg.author.send(embed);
      return;
    }
    if (validation.isRole(msg, "DJ")) {
      embed.fields.push({
        name: `For DJs:`,
        value: `\`${config.prefix}play https://[url]\`:\tPlays a video 
                \`${config.prefix}join\`:\tJoins your channel 
                \`${config.prefix}leave\`:\tLeaves your channel 
                \`${config.prefix}radio\`:\tPlays a radio  
                \`${config.prefix}pause\`:\tPause playing video 
                \`${config.prefix}resume\`:\tResumes playing video 
                \`${config.prefix}end\`:\tEnds playing video 
                \`${config.prefix}volume 0-200\`:\tChanges volume from 0 to 200
                \`${config.prefix}moveTo \`:\tGet all channels and their ids
                \`${config.prefix}moveTo #\`:\tMoving bot to # Channel
                \`${config.prefix}moveTo me\`:\tMoves bot to you
                \`${config.prefix}follow me\`:\tFollows you 
                \`${config.prefix}follow me\`:\tBot is following you 
                \`${config.prefix}follow (@username)\`:\tBot is following (@username) 
                \`${config.prefix}follow stop\`:\tStop following you `
      });
      embed.setColor("0xff8040");
      msg.author.send(embed);
      return;
    }
    msg.author.send(embed);
    return;
  }
  AYAYA(msg) {
    msg.channel.send("AYAYA");
    msg.channel.send("https://discordemoji.com/assets/emoji/AYAYA.png");
  }

  time(msg) {
    embed = validation.clearEmbed(embed);
    embed.setAuthor("Current time");
    embed.addField(`Month: ${this.getMonth()}`, `Day: ${this.getDay()}`);
    embed.addField(
      `Time`,
      `${new Date().getHours()} hours : ${
        new Date().getMinutes() % 10 >= 0
          ? new Date().getMinutes()
          : "0" + new Date().getMinutes()
      } minutes`
    );
    msg.channel.send(embed);
  }
  getDay() {
    switch (new Date().getDay()) {
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      case 7:
        return "Sunday";
    }
  }
  getMonth() {
    switch (new Date().getMonth()) {
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
    }
  }
}

module.exports = Replies;
