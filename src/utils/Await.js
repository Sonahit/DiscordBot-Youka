const Validation = require("../Validation");
const validation = new Validation();
const config = validation.config;
const ytdl = require("ytdl-core");

module.exports.awaitRadioChoose = async function awaitRadioChoose(
  message,
  author,
  embed
) {
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
    .awaitMessages(filter, { max: 2, time: 10000, errors: ["time"] })
    .then(async msgs => {
      validation.clearEmbed(embed);
      try {
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
          `${msg.content} is wrong pattern try using #1, #2 and etc.\n Type ${
            config.prefix
          }radio again`
        );
        console.log(err);
      }
    })
    .catch(() => {
      if (!sent) {
        validation.clearEmbed(embed);
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

module.exports.awaitEmbedReply = async function awaitEmbedReply(
  message,
  data,
  embed
) {
  embed.setColor("0x00d0ff").setTitle("Current Queue");
  const start = async () => {
    await data.queue.forEach(async (item, index) => {
      await ytdl
        .getInfo(item)
        .then(videoData => {
          embed.addField(
            `${index === 0 ? `#${index} Current Song` : `#${index} Song`}`,
            `Author ${videoData.author.name}**\n${
              videoData.title
            }**\nDuration: ${Math.floor(
              videoData.length_seconds / 60
            )} min ${Math.ceil(data.videoData.length_seconds % 60)} seconds`
          );
        })
        .finally(() => {
          if (embed.fields.length === data.queue.length) {
            embed.fields.sort(
              (a, b) =>
                parseInt(a.name.substring(1, 2)) -
                parseInt(b.name.substring(1, 2))
            );
            message.reply(embed);
          }
        });
    });
  };
  start();
};
