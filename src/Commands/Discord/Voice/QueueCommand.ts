import { Command } from "src/Contracts/Command";
import { Message, MessageEmbed, EmbedField } from "discord.js";
import BaseCommand from "src/Core/BaseCommand";
import { Client } from "src/Core/Client";
import { CheckDjPermissions } from "src/Middlewares/CheckDjPermissions";
import { Middleware } from "src/Contracts/Middleware";
import { DispatcherExists } from "src/Middlewares/DispatcherExists";
import { MusicQueue } from "src/Queues/MusicQueue";
import config from "@config";
import chunk from "src/Utils/chunk";

export default class QueueCommand extends BaseCommand implements Command {
  middlewares: Middleware[] = [];
  messageQueue?: Message;
  subscribedQueue?: MusicQueue;
  pages: MessageEmbed[] = [];
  page: number = 0;

  constructor() {
    super();
    this.middlewares.push(new CheckDjPermissions());
    this.middlewares.push(new DispatcherExists());
  }
  run(args: string[], message: Message, client: Client) {
    const pageSize = client.config.queueSize || 5;
    let queueEmbed;
    if (!this.subscribedQueue) {
      this.subscribedQueue = client.musicQueue;
      queueEmbed = this.prepareQueue(this.subscribedQueue);
    } else if (!this.subscribedQueue.equals(client.musicQueue)) {
      queueEmbed = this.prepareQueue(client.musicQueue);
    } else {
      queueEmbed = this.prepareQueue(this.subscribedQueue);
    }
    const fields = queueEmbed?.fields;
    if (fields) {
      let embeds = [];
      if (pageSize <= fields.length) {
        const chunks = chunk(fields, pageSize) as EmbedField[];
        for (const chunk of chunks) {
          const embed = new MessageEmbed();
          embed.addFields(chunk);
          embeds.push(embed);
        }
      } else {
        for (const field of fields) {
          const embed = new MessageEmbed();
          embed.addFields(field);
          embeds.push(embed);
        }
      }
      this.pages = embeds;
    }
    message.channel.send(this.pages[this.page]);
  }

  prepareQueue(queue: MusicQueue): MessageEmbed {
    const embed = new MessageEmbed();
    embed.setColor("0x00d0ff").setTitle("Current Queue");
    let index = 1;
    for (const val of queue) {
      const musDescription = queue.getShortDescription(val);
      embed.addField(index === 1 ? `#${index++} Current Song` : `#${index++} Song`, musDescription);
    }
    return embed;
  }
  description(): string {
    return "show current music queue";
  }
  commandName(): string {
    return "queue";
  }

  example(): string {
    return "";
  }
}
