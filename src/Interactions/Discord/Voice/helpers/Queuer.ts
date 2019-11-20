import { MessageReaction, Message, User, Client } from "discord.js";
import Discord from "discord.js";
import client from "../../../../utils/Client";
import config from "../../../../../config/config";
import { videoInfo } from "ytdl-core";
import { youtube_v3 } from "googleapis";
import { isNull } from "util";

export function showCurrentSong(msg: Message, currentSong: videoInfo, mode = "play") {
  const embed = new Discord.MessageEmbed();
  let durationMin = Math.floor(currentSong.player_response.videoDetails.lengthSeconds / 60);
  let durationSec = Math.ceil(currentSong.player_response.videoDetails.lengthSeconds % 60);
  let stream = currentSong.player_response.videoDetails.isLiveContent;
  embed
    .setColor("#b92727")
    .setAuthor(
      `${currentSong.author.name}`,
      `${currentSong.author.avatar}`,
      `${currentSong.author.channel_url}${currentSong.player_response.videoDetails.channelId}`
    )
    .setThumbnail(`${currentSong.player_response.videoDetails.thumbnail.thumbnails[0].url}`)
    .setDescription(
      `${
        mode === "play"
          ? "Now playing " + currentSong.player_response.videoDetails.title
          : "Added to queue " + currentSong.player_response.videoDetails.title
      }`
    )
    .addField(
      `${stream ? "Live Stream" : "Duration"}`,
      `${stream ? `Thanks to ${currentSong.author.name}` : durationMin + " min"}  ${durationSec === 0 ? " " : durationSec + " seconds"} `
    );
  msg.channel.send(embed);
}

export async function awaitRadioChoose(message: Message, author: User) {
  const embed = new Discord.MessageEmbed();
  embed.setTitle("Radio stations");
  embed.setURL("https://www.internet-radio.com/search/?radio=mp3&page=/#");
  embed.setDescription("Available stations:");
  embed.setColor("#0xffaaff");
  config.radioList.forEach((item, index) => {
    embed.addField(`#${index + 1} ${item.name}`, `Jenre: ${item.jenre}`);
  });
  embed.addField("How to choose?", "Choose radio by typing #1, #2 and etc.");
  message.reply(embed);
  let sent = false;
  let url = "";
  const filter = (msg: Message) => msg.author.bot === false && msg.author.id === author.id && sent === false;
  await message.channel
    .awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] })
    .then(async msgs => {
      try {
        const embed = new Discord.MessageEmbed();
        let msg = msgs.values().next().value;
        embed.addField("Now starting...", `${config.radioList[parseInt(msg.content.split("#")[1]) - 1].name}`);

        embed.setThumbnail("http://www.modelradiolive.net/wp-content/uploads/2017/06/radio_mike.jpg");
        await message.reply(embed);
        sent = true;
        url = config.radioList[parseInt(msg.content.split("#")[1]) - 1].URL;
      } catch (err) {
        message.reply(`${message.content} is wrong pattern try using #1, #2 and etc.\n Type ${config.prefix}radio again`);
        console.log(err);
      }
    })
    .catch(() => {
      if (!sent) {
        const embed = new Discord.MessageEmbed();
        embed.setTitle("Due to inactivity");
        let number = Math.floor(Math.random() * config.radioList.length);
        embed.addField("Now starting...", `${config.radioList[number].name}`);
        embed.setThumbnail("http://www.modelradiolive.net/wp-content/uploads/2017/06/radio_mike.jpg");
        message.reply(embed);
        url = config.radioList[number].URL;
      }
    });
  return url;
}

export async function showQueue(msg: Message, videos: any) {
  const overflowEmbed = 5;
  const queue = (await prepareQueue(videos)
    .then(video => {
      if (video.fields.length >= overflowEmbed) {
        const client = require("../../utils/Client");
        client.queue = {
          onePage: new Discord.MessageEmbed(video)
        };
        const pages = [];
        for (let i = 0; i < video.fields.length; i++) {
          const last = pages[pages.length - 1];
          if (!last || last.length === overflowEmbed) {
            pages.push([video.fields[i]]);
          } else {
            last.push(video.fields[i]);
          }
        }
        video.fields = pages as any;
        client.queue.multiPage = new Discord.MessageEmbed(video);
      }
      return video;
    })
    .catch(err => {
      console.error(err);
    })) as Discord.MessageEmbed;
  if (Array.isArray(queue.fields[0])) {
    const firstPage = new Discord.MessageEmbed(queue);
    firstPage.fields = queue.fields[0] as any;
    firstPage.setFooter(`1/${client.queue.multiPage.fields.length}`);
    msg.channel
      .send(firstPage)
      .then(msg => {
        msg.react("⏪");
        msg.react("◀");
        msg.react("▶");
        msg.react("⏩");
        client.emit("subscribe", { id: msg.id, date: Date.now() });
      })
      .catch(err => {
        console.error(err);
      });
  } else {
    msg.channel.send(queue);
  }
}

//Remember message with queue
client.on("subscribe", (data: any) => {
  client.subscription = {
    messageId: data.id,
    date: data.date,
    pages: client.queue.multiPage.fields.length,
    page: 0
  };
});

client.addListener("messageReactionAdd", (react: MessageReaction) => {
  if (react.message.id === client.subscription.messageId) {
    client.emit("switchPageInPlayer", react);
  }
});

client.on("switchPageInPlayer", (react: MessageReaction) => {
  if (react.message.id === client.subscription.messageId && hasNonBotReactions(react, client)) {
    switch (react.emoji.name) {
      case "⏪": {
        client.subscription.page = 0;
        break;
      }
      case "◀": {
        if (client.subscription.page - 1 >= 0) {
          --client.subscription.page;
        }
        break;
      }
      case "▶": {
        if (client.subscription.page + 1 < client.subscription.pages) {
          client.subscription.page++;
        }
        break;
      }
      case "⏩": {
        client.subscription.page = client.subscription.pages - 1;
        break;
      }
    }
    const page = new Discord.MessageEmbed(client.queue.onePage);
    page.setFooter(`${client.subscription.page + 1}/${client.subscription.pages}`);
    page.fields = client.queue.multiPage.fields[client.subscription.page];
    removeUserReaction(react);
    react.message.edit(page);
  }
});

export function getYoutubePlaylist(options: any, youtubeApi: youtube_v3.Youtube): Promise<void | youtube_v3.Schema$PlaylistItem[] | undefined> {
  return youtubeApi.playlistItems
    .list({
      part: options.part,
      playlistId: options.playlistId,
      pageToken: options.pageToken ? options.pageToken : ""
    })
    .then(async list => {
      if (list.data.nextPageToken) {
        options["pageToken"] = list.data.nextPageToken;
        const videos = await getYoutubePlaylist(options, youtubeApi);
        if (!videos) return;
        videos.forEach(video => {
          list.data.items!.push(video);
        });
      }
      return list.data.items;
    })
    .catch(err => {
      console.log(err);
    });
}

function hasNonBotReactions(react: MessageReaction, bot: Client) {
  return react.users.some(user => {
    return !isNull(bot.user) && user.id !== bot.user.id;
  });
}

function removeUserReaction(react: MessageReaction) {
  const user = react.users.find(user => {
    return user.bot === false;
  });
  react.users.remove(user);
}

async function prepareQueue(queue: Array<string>) {
  const embed = new Discord.MessageEmbed();
  embed.setColor("0x00d0ff").setTitle("Current Queue");
  const promises = queue.map((song, index) => {
    require("ytdl-core")
      .getInfo(song)
      .then((videoData: videoInfo) => {
        embed.addField(
          `${index === 0 ? `#${index + 1} Current Song` : `#${index + 1} Song`}`,
          `Author ${videoData.author.name}**\n[${videoData.player_response.videoDetails.title}](${videoData.video_url})**\nDuration: ${Math.floor(
            videoData.player_response.videoDetails.lengthSeconds / 60
          )} min ${Math.ceil(videoData.player_response.videoDetails.lengthSeconds % 60)} seconds`
        );
      })
      .catch((err: any) => {
        console.error(err);
      });
  });
  await Promise.all(promises).then(() => {
    embed.fields.sort(
      (a, b) =>
        parseInt(a.name.split(" ")[0].substring(1, a.name.split(" ")[0].length)) -
        parseInt(b.name.split(" ")[0].substring(1, b.name.split(" ")[0].length))
    );
  });
  return embed;
}
