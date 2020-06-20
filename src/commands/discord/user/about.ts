import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { Middleware } from "@core/contracts/Middleware";
import config from "@utils/config";
import redis from "@utils/redis";
import { promisify } from "util";
import User from "@core/entity/User";
import trans from "@utils/trans";
import { CommandException } from "@core/exceptions/CommandException";
import avatar from "@utils/avatar";

export default class AboutCommand extends BaseCommand  {
  middlewares?: Middleware[] | undefined;
  async run(args: string[], message: Message, client: Client) {
    const redisConnection = redis();
    const { author } = message;
    let userId = message.author.id;
    const mentionedUser = message.mentions.users.first();
    if(mentionedUser) {
      userId = mentionedUser.id;
    }
    let resp = "";
    try {
    resp = await promisify(redisConnection.get).call(redisConnection, userId);
    } catch (e) {
      logger.error(e.message);
      throw new CommandException(message, trans('system.server_fault'));
    }
    let user: User = JSON.parse(resp);
    if(!user) {
      user = {
        id: author.id,
        username: author.username,
        description: "No description",
        avatar: avatar(author.id, author.avatar) || author.defaultAvatarURL,
        color: "WHITE",
        footerDescription: "No description",
        footerIcon: avatar(author.id, author.avatar) || author.defaultAvatarURL
      };
      await promisify(redisConnection.set).call(redisConnection, user.id, JSON.stringify(user));
    }
    const embed = new MessageEmbed();
    embed.setAuthor(user.username, user.avatar);
    embed.setDescription(user.description);
    embed.setColor(user.color);
    if(user.footerDescription){
      embed.setFooter(user.footerDescription, user.footerIcon);
    }
    embed.setTitle(user.title || user.username);
    return message.channel.send(embed);
  }

  description(): string {
    return "Update user's profile description";
  }

  commandName(): string {
    return "about";
  }

  example(): string {
    return `${config("config.prefix")}${this.commandName()}`;
  }
}
