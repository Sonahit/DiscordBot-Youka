import { Command } from "@core/contracts/Command";
import { Message } from "discord.js";
import BaseCommand from "@core/BaseCommand";
import { Client } from "@core/Client";
import { Middleware } from "@core/contracts/Middleware";
import { App } from "@core/App";
import { MessageEmbed } from "discord.js";
import config from "@utils/config";

export default class HelpCommand extends BaseCommand  {
  middlewares?: Middleware[] | undefined;

  run(args: string[], message: Message, client: Client) {
    const commandRegistrant = App.getInstance().commandRegistrant;
    const commandStorage = commandRegistrant.getCommandStorage();
    const iterator = commandStorage.values();
    const commands: Command[] = [];
    let commandIterator;
    while ((commandIterator = iterator.next())) {
      if (commandIterator.done) {
        break;
      }
      const command = commandIterator.value as Command;
      commands.push(command);
    }
    const embed = new MessageEmbed();
    embed.setTitle(`Available commands`);
    embed.setFooter(`Requested by ${message.author.username}`, `${message.author.avatarURL() || "https://i.redd.it/1cp6bf2ahaky.jpg"} `);
    embed.addField(` You said you need ?HELP?`, `${":cry:".repeat(8)}`);
    embed.setColor("0xff8040");
    for (const command of commands) {
      const [commandName, description, example] = [command.commandName(), command.description(), command.example()];
      embed.addField(commandName, `${description.toLowerCase()}\n${example}`);
    }
    message.author.send(embed);
  }

  description(): string {
    return "Get list of commands";
  }
  commandName(): string {
    return "help";
  }
  example(): string {
    return `${config("config.prefix")}${this.commandName()}`;
  }
}
