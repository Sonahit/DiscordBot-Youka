const Discord = require("discord.js");

module.exports.isListURL = function isListURL(playListURL) {
  return /https|www|youtube|com/gi.test(playListURL);
};

module.exports.parseIntoId = function parseIntoId(playListURL = "") {
  let url = playListURL.trim();
  url = url.substring(url.indexOf("list=") + "list=".length, url.length);
  const id = url.split("&")[0];
  return id;
};

module.exports.getYoutubePlayList = async function getYoutubePlayList(
  options,
  youtubeApi
) {
  return await youtubeApi.playlistItems
    .list({
      part: options.part,
      playlistId: options.playlistId,
      pageToken: options.pageToken ? options.pageToken : ""
    })
    .then(async list => {
      if (list.data.nextPageToken) {
        options["pageToken"] = list.data.nextPageToken;
        let videos = await getYoutubePlayList(options, youtubeApi);
        videos.forEach(video => {
          list.data.items.push(video);
        });
      }
      return list.data.items;
    })
    .catch(err => {
      console.log(err);
    });
};


module.exports.isPlayingMusic = function isPlayingMusic(
  music = false,
  radio = false
) {
  return music || radio;
};
function showVideoData(msg, videoData, mode = "play") {
  const embed = new Discord.MessageEmbed();
  let durationMin = Math.floor(videoData.length_seconds / 60);
  let durationSec = Math.ceil(videoData.length_seconds % 60);
  let stream = videoData.player_response.videoDetails.isLiveContent;
  embed
    .setColor("#b92727")
    .setAuthor(
      `${videoData.author.name}`,
      `${videoData.author.avatar}`,
      `${videoData.author.channel_url}${
        videoData.player_response.videoDetails.channelId
      }`
    )
    .setThumbnail(
      `${videoData.player_response.videoDetails.thumbnail.thumbnails[0].url}`
    )
    .setDescription(
      `${
        mode === "play"
          ? "Now playing " + videoData.title
          : "Added to queue " + videoData.title
      }`
    )
    .addField(
      `${stream ? "Live Stream" : "Duration"}`,
      `${
        stream ? `Thanks to ${videoData.author.name}` : durationMin + " min"
      }  ${durationSec === 0 ? " " : durationSec + "seconds"} `
    );
  msg.channel.send(embed);
}

module.exports.showVideoData = showVideoData;
