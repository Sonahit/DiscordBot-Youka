const Discord = require("discord.js");
const embed = new Discord.RichEmbed();
const config = require("../../config/config");
const Validation = require("../Validation");
const validation = new Validation();

module.exports = class Moving {
  cunstructor() {
    this.currentChannel = "";
    this.ids = [];
    this.voiceChannels = [];
  }
  Move(msg, client) {
    if (
      msg.content === `${config.prefix}moveTo` ||
      msg.content === `${config.prefix}move`
    ) {
      embed.setColor("0xff8040");
      embed.setDescription(
        `Type !move[To] [name] (number) to move a bot or {name}`
      );
      embed.fields.push({
        name: "Avaiable rooms:",
        value: `${this.getRooms(msg.guild.channels)}`
      });
      msg.reply(embed);
    }
    if (msg.content === "!move to me") {
      msg.member.voiceChannel.join().then(connection => {
        msg.reply(`Successfully connected to ${msg.member.voiceChannel.name}`);
        this.currentChannel = channel.id;
      });
    }
    if (validation.checkBotMove(msg.content)) {
      this.getRooms(msg.guild.channels);
      let split = msg.content.split(" ");
      let channel = this.getChannel(split[1]);
      if (!channel) return console.error("The channel does not exist!");
      channel
        .join()
        .then(connection => {
          msg.reply(`Successfully connected to ${channel.name}`);
          this.currentChannel = channel.id;
          console.log(`Successfully connected to ${channel.name}`);
        })
        .catch(e => {
          // Oh no, it errored! Let's log it to console :)
          console.error(e);
        });
    }
  }
  getRooms(channels = []) {
    this.voiceChannels = [];
    this.ids = [];
    let i = 0;
    channels.forEach((item, index) => {
      if (item.type == "voice" && item.joinable === true) {
        this.voiceChannels.push(
          `Channel number ->\t${++i}\t->\t\t${item.name}\n`
        );
        this.ids.push(item.id);
      }
    });
    return this.voiceChannels;
  }
  getChannel(id, client) {
    for (let i = 0; i < this.ids.length; i++) {
      if (i === parseInt(id) - 1) {
        return client.channels.get(this.ids[i]);
      }
    }
  }
};
