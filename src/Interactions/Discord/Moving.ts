import Discord, { Message, Client, GuildMember, GuildChannel, VoiceChannel, UserResolvable } from "discord.js";
import config from "../../../config/config";
import { MovingHandler } from "typings";

class Moving implements MovingHandler {
  follows: {
    follow: boolean;
    user: UserResolvable | string;
  };

  currentChannel: string;
  idInterval: NodeJS.Timeout | number;

  constructor() {
    this.currentChannel = "";
    this.idInterval = 0;
    this.follows = {
      follow: false,
      user: "no one"
    };
  }

  moveTo(msg: Message) {
    if (msg.content === `${config.prefix}moveTo`) {
      const embed = new Discord.MessageEmbed();
      embed.setColor("0xff8040");
      embed.setDescription(`Type ${config.prefix}moveTo (number) to move bot to certain channel`);
      getVoiceChannels(msg.guild!.channels)
        .array()
        .forEach((channel, i) => {
          embed.addField(`Room #${i + 1}`, `\`\`\` ${channel!.name} \`\`\``);
        });
      msg.reply(embed);
    } else if (msg.content === `${config.prefix}moveTo me`) {
      if (msg.member!.voice.channel) {
        msg.member!.voice.channel.join().then(() => {
          const channelName = msg.member!.voice.channel!.name;
          msg.reply(`Successfully connected to ${channelName}`);
          this.currentChannel = msg!.channel.id;
        });
      }
    } else if (global.validator.checkBotMove(msg.content)) {
      getVoiceChannels(msg!.guild!.channels);
      const voiceChannelId = msg.content.split(" ")[1];
      const channel = getChannel(parseInt(voiceChannelId) - 1, msg) as GuildChannel;
      if (!(channel instanceof VoiceChannel)) return logger.error("The channel does not exist!");
      channel
        .join()
        .then(() => {
          msg.reply(`Successfully connected to ${channel.name}`);
          this.currentChannel = msg.channel.id;
          logger.info(`Successfully connected to ${channel.name}`);
        })
        .catch(e => {
          logger.error(e);
          logger.error("The channel does not exist!");
        });
    }
  }
  follow(msg: Message, client: Client) {
    const mentioned = msg.mentions.users.first() as Discord.User;
    const user = msg.guild!.member(mentioned);
    if (user) {
      this["follow user"](msg, client, user);
    }
    if (msg.content.includes("follow me")) {
      this["follow me"](msg);
    } else if (msg.content.includes("follow stop")) {
      this["follow stop"](msg);
    }
  }
  "follow user"(msg: Message, client: Client, user: GuildMember) {
    if (user.voice.channel && this.follows.follow === false) {
      this.idInterval = setInterval(() => {
        followUser(user, this as Moving);
      }, 1000);
      this.follows.follow = true;
      this.follows.user = user.user;
      msg.channel.send(`Following <@${this.follows.user.id}>`);
    } else {
      user.send(`Join to voice channel first or I am following someone`);
    }
  }
  "follow me"(msg: Message) {
    if (msg.member!.voice.channel && this.follows.follow === false) {
      this.idInterval = setInterval(() => {
        follow(msg, this as Moving);
      }, 1000);
      this.follows.follow = true;
      this.follows.user = msg.author;
      msg.channel.send(`Following <@${msg.author.id}>`);
    } else {
      if (typeof this.follows.user !== "string") {
        msg.author.send(`Join to voice channe}l first or I am following <@${this.follows.user.id}>`);
      }
    }
  }

  "follow stop"(msg: Message) {
    if (
      msg.content === `${config.prefix}follow stop` &&
      typeof this.follows.user !== "string" &&
      (<Discord.User>this.follows.user).username === msg.author.username
    ) {
      if (this.follows.follow) {
        clearInterval(this.idInterval as number);
        msg.channel.send(`Stopped following <@${this.follows.user.id}>`);
        this.follows.user = "no one";
        this.follows.follow = false;
      } else {
        if (typeof this.follows.user !== "string") {
          msg.reply(`I am following <@${this.follows.user.id}>`);
        } else {
          msg.reply(`I am not following anyone`);
        }
      }
    }
  }
}

export function getChannel(id: number, msg: Message): GuildChannel | undefined {
  const voiceChannel = getVoiceChannels(msg.guild!.channels).array()[id];
  if (!voiceChannel) return undefined;
  const channel = msg.guild?.channels.find(ch => ch.id === voiceChannel.id);
  return channel;
}
export function follow(msg: Message, moving: Moving) {
  if (msg.member && msg.member.voice.channel) {
    msg.member.voice.channel.join();
    moving.currentChannel = msg.member.voice.channel.name;
  } else {
    clearInterval(moving.idInterval as number);
    moving.follows.follow = false;
    moving.follows.user = "no one";
  }
}

export function followUser(user: GuildMember, moving: Moving) {
  if (user != null) {
    if (user.voice.channel) {
      user.voice.channel.join();
      moving.currentChannel = user.voice.channel.name;
    }
  } else {
    clearInterval(moving.idInterval as number);
    moving.follows.follow = false;
    moving.follows.user = "no one";
  }
}

export function getVoiceChannels(channels: Discord.GuildChannelStore) {
  const voice = channels.filter(item => {
    return item instanceof Discord.VoiceChannel;
  });
  return voice;
}
export default Moving;
