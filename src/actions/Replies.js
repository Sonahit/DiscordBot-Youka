const { client, Attachment } = require("discord.js");
const config = require("../../config/config");
const Discord = require("discord.js");
const embed = new Discord.RichEmbed();

class Replies {
  Greet(msg, client){
    embed.setColor("0xfafa33");
    embed.setAuthor(`${client.user.username}`);
    embed.setThumbnail(`https://pbs.twimg.com/profile_images/1040094061057650688/wNO6rNzn_400x400.jpg`);
    embed.setDescription(`Hello! If you need any help type !help`)
    msg.reply(embed);
  }
  Credits(msg,client){
    embed.setColor("0xffffff");
    embed.setAuthor(`@IvanSadykov`);
    embed.setThumbnail(`https://pmcvariety.files.wordpress.com/2018/05/discord-logo.jpg?w=1000&h=563&crop=1`);
    embed.setDescription('Hello! I am author of this bot! If you have any suggestions please contact me at github or via email.');
    embed.addField('GitHub',"https://github.com/Sonahit/");
    embed.addField('Gmail','grandpajok@gmail.com');
    embed.addBlankField();
    embed.setFooter('Sincerely @IvanSadykov', `https://media.discordapp.net/attachments/563442639265988641/563908892262662144/AYAYA.png`);
    msg.author.send(embed);
  }
  Start(msg) {
    const current = msg.author;
    current.send(`...Started!`);
  }
  Pong(msg) {
    msg.reply("Pong! :D");
  }
  Relog(msg) {
    const current = msg.author;
    current.send(`You need to restart bot!`);
  }
  Restart(msg) {
    const current = msg.author;
    current.send(`...Restarting`);
  }
  Error(msg) {
    const current = msg.author;
    current.send(`You are not owner of this bot!`);
    current.send(`Stop trying to destroy not your stuff!`);
    current.send(":japanese_goblin:");
  }
  async Help(msg) {
    const attachment = new Attachment(
      "https://discordemoji.com/assets/emoji/AYAYA.png"
    );
    const current = msg.author;
    const cry = ":cry:";
    await current.send(attachment);
    if (isAuthor(msg)) {
      embed.setTitle("Help");
      embed.fields.push(
        {
          name: ` You said you need ?HELP?`,
          value: `${cry.repeat(8)}`
        },
        {
          name: `Available commands:`,
          value: ` AYAYA:\tAYAYA                         
                                 **!ping**:\tTypes a reply pong 
                                 **!help**:\tGet help`
        }
      );
      embed.fields.push({
        name: `For DJs:`,
        value: ` **!play https://[url]**:\tPlays a video 
                                 **!join**:\tJoins your channel 
                                 **!leave**:\tLeaves your channel 
                                 **!stream https://[url]**:\tPlays a youtube stream   
                                 **!pause**:\tPause playing video 
                                 **!resume**:\tResumes playing video 
                                 **!end**:\tEnds playing video 
                                 **!move to me**:\tMoves bot to you
                                 **!move(To)**:\tGet all channels and their ids
                                 **!move(To) #**:\tMoving bot to # Channel
                                 **!move(To) name #**:\tMoving {name} to # Channel`
      });
      embed.fields.push({
        name: `For Admins:`,
        value: ` **!disconnect**:\tShutdowns bot  
                                **!restart**:\tRestarts bot`
      });
      embed.setColor("0xff8040");
      current.send(embed);
      return;
    }
    if (isDj(msg)) {
      embed.fields.push(
        {
          name: ` You said you need ?HELP?`,
          value: `${cry.repeat(8)}`
        },
        {
          name: `Available commands:`,
          value: ` AYAYA:\tAYAYA                         
                                         **!ping**:\tTypes a reply pong 
                                         **!help**:\tGet help`
        }
      );
      embed.fields.push({
        name: `For DJs:`,
        value: ` **!play https://[url]**:\tPlays a video 
                                 **!join**:\tJoins your channel 
                                 **!leave**:\tLeaves your channel 
                                 **!stream https://[url]**:\tPlays a youtube stream   
                                 **!pause**:\tPause playing video 
                                 **!resume**:\tResumes playing video 
                                 **!end**:\tEnds playing video 
                                 **!move to me**:\tMoves bot to you
                                 **!move(To)**:\tGet all channels and their ids
                                 **!move(To) #**:\tMoving bot to # Channel
                                 **!move(To) name #**:\tMoving {name} to # Channel`
      });
      embed.setColor("0xff8040");
      current.send(embed);
      return;
    }
    embed.fields.push(
      {
        name: ` You said you need ?HELP?`,
        value: `${cry.repeat(8)}`
      },
      {
        name: `Available commands:`,
        value: ` AYAYA:\tAYAYA                         
                                 **!ping**:\tTypes a reply pong 
                                 **!help**:\tGet help`
      }
    );
    current.send(embed);
    return;
  }
  AYAYA(msg) {
    const current = msg.channel;
    current.send("AYAYA");
    current.send("https://discordemoji.com/assets/emoji/AYAYA.png");
  }
  Time(msg) {
    const current = msg.channel;
    current.send(
      "Current time:\n" +
        this.getMonth() +
        "\t:\t" +
        this.getDay() +
        "\n\t" +
        new Date().getHours() +
        ":" +
        new Date().getMinutes()
    );
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
function isAuthor(msg) {
  return (
    msg.author.client.user.username.indexOf(config.owners) &&
    msg.author.client.user.discriminator.indexOf(config.owners)
  );
}

function isDj(msg) {
  return (
    msg.author.client.user.username.indexOf(config.djs) &&
    msg.author.client.user.discriminator.indexOf(config.djs)
  );
}
module.exports = Replies;
