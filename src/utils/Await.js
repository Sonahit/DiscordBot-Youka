const Validation = require("../Validation");
const validation = new Validation();
const config = validation.config;

module.exports.awaitRadioChoose = async function awaitRadioChoose(message,author, embed){
    embed.setTitle("Radio stations");
    embed.setURL("https://www.internet-radio.com/search/?radio=mp3&page=/#");
    embed.setDescription("Available stations:");
    embed.setColor("#0xffaaff");
    config.RadioList.forEach((item, index) => {
        embed.addField(`#${index+1} ${item.name}`, `Jenre: ${item.Jenre}`)
    });
    embed.addField("How to choose?","Choose radio by typing #1, #2 and etc.");
    message.reply(embed);
    let sent = false;
    let url = "";
    const filter = msg => msg.author.bot === false && msg.author.id === author.id && sent === false
    await message.channel.awaitMessages( filter, {max: 1, time: 2000, errors: ['time']})
    .then((msgs) => {
        validation.clearEmbed(embed);
            try{
                let msg = msgs.values().next().value();
                embed.addField('Now starting...', `${config.RadioList[parseInt(msg.content.split("#")[1])-1].name}`);
            
                embed.setThumbnail(
                    "http://www.modelradiolive.net/wp-content/uploads/2017/06/radio_mike.jpg"
                );
                msg.reply(embed);
                sent = true;
                url = config.RadioList[parseInt(msg.content.split("#")[1])-1].URL;
            } catch (err){
                msg.reply(`${msg.content} is wrong pattern try using #1, #2 and etc.\n Type ${config.prefix}radio again`)
            }
        
    }).catch(() => {
        if(!sent){
            validation.clearEmbed(embed);
            embed.setTitle("Due to inactivity");
            embed.addField('Now starting...', `${config.RadioList[Math.floor(Math.random() * config.RadioList.length)].name}`);
            embed.setThumbnail(
                "http://www.modelradiolive.net/wp-content/uploads/2017/06/radio_mike.jpg"
            );
            message.reply(embed);
            url = config.RadioList[0].URL;
        }
    });
    return url;
  }