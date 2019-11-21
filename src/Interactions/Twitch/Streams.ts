import IO from "../../utils/IO";
import Requests from "./Requests";

import Discord from "discord.js";
import config from "../../../config/config";
import { StreamsHandler } from "typings";

const requests = new Requests();

class Streams implements StreamsHandler {
  headers: {
    [header: string]: any;
  };
  constructor() {
    this.headers = {
      "Client-ID": config.twitch.client_id
    };
  }
  stream(msg: Discord.Message) {
    if (!msg.member) {
      return;
    }
    const option = msg.content.split(" ")[1];
    switch (option) {
      case "current": {
        this.current(msg);
        break;
      }
      case "remind": {
        this.remind(msg);
        break;
      }
      default: {
        msg.reply("Wrong option, try again");
      }
    }
  }

  async current(msg: Discord.Message) {
    const streamName = msg.content.split(`${config.prefix}stream current`)[1].trim();
    if (streamName) {
      msg.reply((await this.getStreamerInfo(streamName, new Discord.MessageEmbed())).embed);
    } else {
      msg.reply("Provide streamer's name");
    }
  }

  //Webhook Event emitter
  async remind(msg: Discord.Message) {
    const content = msg.content.split(`${config.prefix}stream remind`)[1].trim();
    const time = parseInt(content.split(" ")[1]);
    const streamName = content.split(" ")[0];
    if (streamName && time && time >= 60) {
      const stream = await this.getStreamerInfo(streamName, new Discord.MessageEmbed());
      if (!stream.isOnline) {
        const id = setInterval(async () => {
          const info = await this.getStreamerInfo(streamName, new Discord.MessageEmbed());
          if (info.isOnline) {
            msg.author.send(info.embed);
            clearInterval(id);
          } else {
            const file = new IO();
            const dir = `${__dirname}/user_data`;
            file.remindToFile(dir, {
              time: time,
              user: {
                name: msg.author.username,
                id: msg.author.id
              }
            });
          }
        }, time * 1000);
        msg.author.send(`Will remind you in ${time} seconds about ${streamName} until he's online`);
      } else {
        msg.author.send(stream.embed);
      }
    } else {
      if (!streamName) {
        msg.reply("Provide streamer's name");
      }
      if (!time || time <= 60) {
        msg.reply("Provide interval bigger than 60 seconds");
      }
    }
  }

  getStreamerInfo(streamName: string, embed: Discord.MessageEmbed) {
    const host = config.twitch.api;
    return requests
      .get(this.getApiUrl(host, "streams", { user_login: streamName }), {
        headers: this.headers,
        timeout: 3000
      })
      .then(res => {
        const streamer = res.data[0];

        return requests
          .get(this.getApiUrl(host, "games", { id: streamer.game_id }), {
            headers: this.headers,
            timeout: 3000
          })
          .then(res => {
            const game = res.data[0];
            if (streamer && streamer.type === "live") {
              const thumbnail = streamer.thumbnail_url.replace(/{width}/g, 100).replace(/{height}/g, 100);
              embed
                .setColor("#56fc69")
                .setAuthor(
                  streamer.user_name,
                  game.box_art_url.replace(/{width}/g, 100).replace(/{height}/g, 100),
                  `https://www.twitch.tv/${streamName}`
                )
                .setDescription(`Playing ${game.name} \n ${streamer.title}`)
                .setFooter(`Currently ${streamer.viewer_count} viewers. Started -->`)
                .setTimestamp(new Date(streamer.started_at))
                .setThumbnail(thumbnail);
            } else {
              embed
                .setColor("#000000")
                .setAuthor(
                  streamName,
                  "https://cdn1.iconfinder.com/data/icons/simple-icons/4096/twitch-4096-black.png",
                  `https://www.twitch.tv/${streamName}`
                )
                .setDescription(`Offline`);
            }
            return {
              embed,
              isOnline: streamer && streamer.type === "live"
            };
          });
        //100 x 100 image jpg
      });
  }

  getApiUrl(host: string, path: string, options = {}) {
    const query = require("querystring");
    const params = query.stringify(options);
    const url = `${host}/${path}?${params}`;
    return url;
  }
}

export default Streams;
