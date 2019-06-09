const ytdlVideo = require("ytdl-core");
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

module.exports.getYoutubePlayList = function getYoutubePlayList(
  options,
  youtubeApi
) {
  return youtubeApi.playlistItems
    .list({
      part: options.part,
      playlistId: options.playlistId,
      pageToken: options.pageToken ? options.pageToken : ""
    })
    .then(async list => {
      if (list.data.nextPageToken) {
        options["pageToken"] = list.data.nextPageToken;
        let videos = await getYoutubePlayList(options);
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

module.exports.Play = async function Play(
  connection,
  data,
  msg,
  streamOptions
) {
  data.videoData = await ytdlVideo.getInfo(data.queue[0]);
  showVideoData(msg, data.videoData, "play");
  try {
    data.dispatcher = await connection.play(
      await ytdlVideo(data.queue[0]),
      streamOptions
    );
    console.log("STARTED PLAYING SONG");
  } catch (err) {
    msg.reply("WRONG URL");
  }
  data.dispatcher.on("end", reason => {
    reason = reason || "end";
    console.log(`FINISHED PLAYING A SONG BECAUSE ${reason}`);
    finish(connection, data, reason, msg, streamOptions);
  });
};

function finish(connection, data, reason, msg, streamOptions) {
  data.skippedSong = data.queue.shift();
  if (reason === "rerun") {
    data.skippedSong = "";
  }
  if (reason === "force" || data.queue.length === 0) {
    data.playing = false;
    msg.channel.send(`End of queue`);
    if (reason === "force") {
      data.queue = [];
    }
    connection.disconnect();
  } else {
    this.Play(connection, data, msg, streamOptions);
  }
}

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
