import { Command } from "src/Contracts/Command";
import { Middleware } from "src/Contracts/Middleware";
import { Message, MessageEmbed } from "discord.js";
import { App } from "src/Core/App";
import BaseCommand from "src/Core/BaseCommand";
import { Client } from "src/Core/Client";

export default class HelpCommand extends BaseCommand implements Command {
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
      embed.addField(commandName, `${description.toLowerCase()}\n${client.config.prefix}${example}`);
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
    return `help`;
  }
}
