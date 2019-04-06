const ytdlVideo = require('ytdl-core');
const ytdl = require('ytdl-core-discord');
const streamOptions = { volume: 0.03, passes: 3 };
const fileOptions = {volume: 0.15, passes: 3}
const Discord = require('discord.js');
const embed = new Discord.RichEmbed();

function Play(connection, data, message) {
    embed.setColor("#b92727");
    embed.setDescription(`Now playing ${data.info.title} 
                        ${Math.floor(data.info.length_seconds / 60)}  ${Math.ceil(data.info.length_seconds % 60)} long 
                        by ${data.info.author.name}`);
    message.channel.send({ embed });
    data.dispatcher = connection.playStream(ytdlVideo(data.queue[0], {filter: "audioonly"}), streamOptions);
    data.dispatcher.on('end', function(reason) {
        finish(connection, data, reason);
    });
}

function finish(connection, data, reason){
    data.queue.shift();
    if( data.queue.length != 0  ){
        Play(connection, data)    
    } else { 
        data.playing = false;
        console.log(reason);
        connection.disconnect();
    }
}

async function Stream(connection, data, url) {
    data.dispatcher = connection.playOpusStream(await ytdl(url), streamOptions);
       data.dispatcher.on('debug', (info) => {
            console.log('debug');
            console.log(info);
        });
       data.dispatcher.on('error', (info) => {
            console.log('error');
            data.streaming = false;
            console.log(info);
        });
        data.dispatcher.on('end', (reason) => {
            console.log('end');
            data.streaming = false;
            console.log(reason);
        });
}
class Voice {
        constructor(){
            this.data = {
                dispatcher : false,
                info: "",
                queue : [],
                playing: false,
                streaming: false,
            } 
        }
        Join (message) {
            if(message.member != null){
                if (message.member.voiceChannel) {
                    message.member.voiceChannel.join()  
                    } else {
                    message.reply('You need to join a voice channel first!');
                };
            } else {
                const current = message.author;
                current.send(`Stop typying me in pm :angry: `);
            };
        };
        Disconnect (message){
            message.member.voiceChannel.leave();
        };
        Play(message){
            if(message.member != null && this.data.streaming == false){
                    if(message.content === '!playtest'){
                        if (message.member.voiceChannel) {
                            message.member.voiceChannel.join()
                            .then( connection => {
                                this.data.dispatcher = connection.playFile("http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p", fileOptions);
                            })
                            .catch(console.error);
                        } else {
                            message.reply('You need to join a voice channel first!');
                        };
                    } else {
                        let url = message.content.substring(6,message.content.length);
                        if (this.data.playing || this.data.queue > 0){
                            //this.data.queue.push(url);
                            message.reply('Music still playing. WAIT!');
                        } else {
                            if (message.member.voiceChannel) {
                                this.data.playing = true;
                                this.data.queue.push(url);
                                message.member.voiceChannel.join()
                                .then( async connection => {
                                    this.data.info = await ytdlVideo.getInfo(url);
                                    Play(connection, this.data, message);
                                })
                                .catch(console.error);
                            } else {
                                message.reply('You need to join a voice channel first!');
                            }; 
                        };
                    }
                } else {
                    const current = message.author;
                    current.send(`I am streaming!`);
                };
        };
        Stream(message){
            if(message.member != null){
                if (message.member.voiceChannel) {
                    let url = message.content.substring(8,message.content.length);
                    message.member.voiceChannel.join()
                    .then( connection => {
                        Stream(connection, this.data, url);
                    })
                    .catch(console.error);
                } else {
                    message.reply('You need to join a voice channel first!');
                }; 
            } else {
                const current = message.author;
                current.send(`Stop typying me in pm :angry: `);
            };
        };
        Radio(message){
            if(message.member != null){
                if (message.member.voiceChannel) {
                    message.member.voiceChannel.join()
                    .then( connection => {
                            require('http').get("http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p", (res) => {
                            connection.playStream(res, streamOptions);
                            embed.setColor("#b92727");
                            embed.setDescription("Playing radio!");
                            message.channel.send({ embed });
                        });
                    })
                    .catch(console.error);
                } else {
                    message.reply('You need to join a voice channel first!');
                }; 
            } else {
                const current = message.author;
                current.send(`Stop typying me in pm :angry: `);
            };
        }
        Pause(message) {
            if (message.member.voiceChannel && this.data.dispatcher != false) {
                this.data.dispatcher.pause();
            };
        };
        Resume(message) {
            if (message.member.voiceChannel && this.data.dispatcher != false) {
                this.data.dispatcher.resume();
            };
        };
        End(message){
            if (message.member.voiceChannel && this.data.dispatcher != false) {
                this.data.dispatcher.end();
                this.data.playing = false;
            };
            
        };
        changeVolume(message){
            if (message.member.voiceChannel && this.data.dispatcher != false){
                var volume = message.content.substring(8,message.content.length); 
                this.data.dispatcher.setVolume(parseFloat(volume/100));
            };
        }
}
module.exports = Voice;