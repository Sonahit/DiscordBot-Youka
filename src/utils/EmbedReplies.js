const validation = new global.Validation();
const config = validation.config;
const ytdl = require("ytdl-core");
const Discord = require("discord.js");
module.exports.awaitRadioChoose = async function awaitRadioChoose(
  message,
  author
) {
  const embed = new Discord.MessageEmbed();
  embed.setTitle("Radio stations");
  embed.setURL("https://www.internet-radio.com/search/?radio=mp3&page=/#");
  embed.setDescription("Available stations:");
  embed.setColor("#0xffaaff");
  config.RadioList.forEach((item, index) => {
    embed.addField(`#${index + 1} ${item.name}`, `Jenre: ${item.Jenre}`);
  });
  embed.addField("How to choose?", "Choose radio by typing #1, #2 and etc.");
  message.reply(embed);
  let sent = false;
  let url = "";
  const filter = msg =>
    msg.author.bot === false && msg.author.id === author.id && sent === false;
  await message.channel
    .awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] })
    .then(async msgs => {
      try {
        const embed = new Discord.MessageEmbed();
        let msg = msgs.values().next().value;
        embed.addField(
          "Now starting...",
          `${config.RadioList[parseInt(msg.content.split("#")[1]) - 1].name}`
        );

        embed.setThumbnail(
          "http://www.modelradiolive.net/wp-content/uploads/2017/06/radio_mike.jpg"
        );
        await message.reply(embed);
        sent = true;
        url = config.RadioList[parseInt(msg.content.split("#")[1]) - 1].URL;
      } catch (err) {
        message.reply(
          `${
            message.content
          } is wrong pattern try using #1, #2 and etc.\n Type ${
            config.prefix
          }radio again`
        );
        console.log(err);
      }
    })
    .catch(() => {
      if (!sent) {
        embed.setTitle("Due to inactivity");
        let number = Math.floor(Math.random() * config.RadioList.length);
        embed.addField("Now starting...", `${config.RadioList[number].name}`);
        embed.setThumbnail(
          "http://www.modelradiolive.net/wp-content/uploads/2017/06/radio_mike.jpg"
        );
        message.reply(embed);
        url = config.RadioList[number].URL;
      }
    });
  return url;
};

module.exports.awaitEmbedReply = async function awaitEmbedReply(message, data) {
  const embed = new Discord.MessageEmbed();
  embed.setColor("0x00d0ff").setTitle("Current Queue");
  let promises = [];
  data.queue.forEach((item, index) => {
    promises.push(
      ytdl
        .getInfo(item)
        .then(videoData => {
          embed.addField(
            `${
              index === 0 ? `#${index + 1} Current Song` : `#${index + 1} Song`
            }`,
            `Author ${videoData.author.name}**\n[${videoData.title}](${
              videoData.video_url
            })**\nDuration: ${Math.floor(
              videoData.length_seconds / 60
            )} min ${Math.ceil(data.videoData.length_seconds % 60)} seconds`
          );
        })
        .catch(err => {
          console.log(err);
        })
    );
  });
  await Promise.all(promises).then(() => {
    embed.fields.sort(
      (a, b) =>
        parseInt(
          a.name.split(" ")[0].substring(1, a.name.split(" ")[0].length)
        ) -
        parseInt(b.name.split(" ")[0].substring(1, b.name.split(" ")[0].length))
    );
    message.reply(embed);
  });
};
