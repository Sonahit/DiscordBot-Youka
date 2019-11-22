import { MessageAttachment, Message, Client, MessageEmbed } from "discord.js";
import Discord from "discord.js";
import config from "../../../config/config";
import { RepliesHandler } from "typings";

class Replies implements RepliesHandler {
  Greet(msg: Message, client: Client) {
    const embed = new Discord.MessageEmbed();
    embed.setColor("0xfafa33");
    embed.setAuthor(`${client.user!.username}`);
    embed.setThumbnail(`https://pbs.twimg.com/profile_images/1040094061057650688/wNO6rNzn_400x400.jpg`);
    embed.setDescription(`Hello${config.prefix} If you need any help type ${config.prefix}help`);
    msg.reply(embed);
  }
  onHello(msg: Message) {
    msg.channel.send(`Rise and shine <@${msg.author.id}>`);
  }
  author(msg: Message) {
    const embed = new Discord.MessageEmbed();
    embed.setColor("0xffffff");
    embed.setAuthor(`@IvanSadykov`);
    embed.setThumbnail(`https://pmcvariety.files.wordpress.com/2018/05/discord-logo.jpg?w=1000&h=563&crop=1`);
    embed.setDescription(
      `Hello ${msg.author.username}! I am author of this bot. If you have any suggestions please contact me at github or via email.`
    );
    embed.addField("GitHub", "https://github.com/Sonahit/");
    embed.addField("Gmail", "grandpajok@gmail.com");
    embed.addBlankField();
    embed.setFooter("Sincerely @IvanSadykov", `https://media.discordapp.net/attachments/563442639265988641/563908892262662144/AYAYA.png`);
    msg.author.send(embed);
  }
  ping(msg: Message) {
    msg.reply(`Pong! :D`);
  }
  Error(msg: Message) {
    const embed = new Discord.MessageEmbed();
    embed.setAuthor("Validator", "https://cdn.pixabay.com/photo/2012/04/15/19/12/cross-34976_960_720.png");
    embed.setTitle("Error 403");
    embed.setDescription(`You don't have any right <@${msg.author.id}>`);
    embed.addField("What to do?", "PM any online moderators and ask for role Krabik");
    embed.addField("What next?", "Just wait for their response");
    embed.addBlankField();
    embed.addField("What can i do right now?", `You can join any voice channels but your microphone will be switched to "onPush"`);
    embed.setFooter("Sincerely your validator!", "http://i0.kym-cdn.com/photos/images/facebook/001/290/938/4a7.jpg");
    msg.author.send(embed);
  }
  async help(msg: Message) {
    const embed = new Discord.MessageEmbed();
    const attachment = new MessageAttachment("https://discordemoji.com/assets/emoji/AYAYA.png");
    await msg.author.send(attachment);
    embed.setTitle(`Available commands`);
    embed.setFooter(`Requested by ${msg.author.username}`, `${msg.author.avatarURL() || "https://i.redd.it/1cp6bf2ahaky.jpg"} `);
    embed.addField(` You said you need ?HELP?`, `${":cry:".repeat(8)}`);
    embed.setColor("0xff8040");
    msg.author.send(this.getHelpMessage(embed, this.getPermission(msg)));
    return;
  }

  AYAYA(msg: Message) {
    msg.channel.send("AYAYA");
    msg.channel.send("https://discordemoji.com/assets/emoji/AYAYA.png");
  }

  getPermission(msg: Message) {
    if (global.validator.isWhiteListed(msg.author)) {
      return "author";
    }
    if (global.validator.hasPermission(msg, global.permissions.moderation)) {
      return "mod";
    }
    if (global.validator.hasPermission(msg, global.permissions.voice)) {
      return "voice";
    }
    return "none";
  }
  getHelpMessage(embed: MessageEmbed, permission: string) {
    embed.addField(
      "For All:",
      `AYAYA: AYAYA
      ${config.prefix}ping: Types a reply pong
      ${config.prefix}time: Shows local time of bot
      ${config.prefix}help: Get help
      ${config.prefix}streams current [streamer_name]: Get info about [streamer_name]`
    );
    switch (permission) {
      case "author": {
        this.DJHelp(embed);
        this.AdminHelp(embed);
        break;
      }
      case "mod": {
        this.DJHelp(embed);
        this.AdminHelp(embed);
        break;
      }
      case "voice": {
        this.DJHelp(embed);
        break;
      }
    }
    return embed;
  }

  DJHelp(embed: MessageEmbed) {
    embed.addField(
      `For DJs:`,
      `${config.prefix}play https://[url]: Plays a video
      ${config.prefix}join: Joins your channel
      ${config.prefix}leave: Leaves your channel
      ${config.prefix}radio: Plays a radio
      ${config.prefix}pause: Pause playing video
      ${config.prefix}rerun: Play last played video
      ${config.prefix}resume: Resumes playing video
      ${config.prefix}stop: Ends playing video
      ${config.prefix}skip: Skip video
      ${config.prefix}volume 0-200: Changes volume from 0 to 200
      ${config.prefix}playlist #playlistID: Shows play list at playlist id
      ${config.prefix}playlist play #playlistID: Play all videos at playlist
      ${config.prefix}moveTo: Get all channels and their ids
      ${config.prefix}moveTo #: Moving bot to # Channel
      ${config.prefix}moveTo me: Moves bot to you
      ${config.prefix}follow me: Bot is following you
      ${config.prefix}follow @(username): Bot is following @(username)
      ${config.prefix}follow stop: Stop following you
      `
    );
  }

  AdminHelp(embed: MessageEmbed) {
    embed.addField(
      `For Admins:`,
      `${config.prefix}IAdmin: Set admin mode 
      ${config.prefix}IUser: Set user mode 
      ${config.prefix}[un]mute (name) [reason]: [un]Mute voice of (name) with a [reason]
      ${config.prefix}addPermission (levelPermission) (roles): add new roles with permissions
      ${config.prefix}deletePermission (levelPermission) (roles): delete roles in such permissions
      ${config.prefix}hierarchy: show current hierarchy roles`
    );
  }

  time(msg: Message) {
    const embed = new Discord.MessageEmbed();
    embed.setAuthor("Current time");
    embed.addField(`Month: ${this.getMonth()}`, `Day: ${this.getDay()}`);
    embed.addField(
      `Time`,
      `${new Date().getHours()} hours : ${new Date().getMinutes() % 10 >= 0 ? new Date().getMinutes() : "0" + new Date().getMinutes()} minutes`
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

export default Replies;
