import { BaseQueue } from "./BaseQueue";
import { Music } from "../types/Music";
import { MessageEmbed } from "discord.js";

export class MusicQueue extends BaseQueue<Music> {
  getEmbed(music: Music): MessageEmbed {
    const embed = new MessageEmbed();
    const musicInfo = music.videoInfo;
    const { videoDetails } = musicInfo.player_response;
    const durationMin = Math.floor(videoDetails.lengthSeconds / 60);
    const durationSec = Math.ceil(videoDetails.lengthSeconds % 60);
    const stream = videoDetails.isLiveContent;
    embed
      .setColor("#b92727")
      .setAuthor(`${musicInfo.author.name}`, `${musicInfo.author.avatar}`, `${musicInfo.author.channel_url}`)
      .setThumbnail(`${videoDetails.thumbnail.thumbnails[0].url}`)
      .addField(
        `${stream ? "Live Stream" : "Duration"}`,
        `${stream ? `Thanks to ${musicInfo.author.name}` : durationMin + " min"}  ${durationSec === 0 ? " " : durationSec + " seconds"}`
      )
      .setFooter(`Video URL: ${musicInfo.video_url}`);
    return embed;
  }

  getShortDescription(music: Music): string {
    const { videoInfo } = music;
    const { videoDetails } = videoInfo.player_response;
    const durationMin = Math.floor(videoDetails.lengthSeconds / 60);
    const durationSec = Math.ceil(videoDetails.lengthSeconds % 60);
    return `Author ${videoDetails.author}**\n[${videoDetails.title}](${videoInfo.video_url})**\nDuration: ${durationMin} min ${durationSec} seconds`;
  }

  equals(a: MusicQueue): boolean {
    if (this !== a) {
      return false;
    } else if (this.size() !== a.size()) {
      return false;
    }
    const itA = a.getIterator();
    const itObj = this.getIterator();
    while (itA.hasNext()) {
      const mA = itA.next().value as Music;
      const mObj = itObj.next().value as Music;
      if (mA.url !== mObj.url) {
        return false;
      }
    }
    return true;
  }
}
