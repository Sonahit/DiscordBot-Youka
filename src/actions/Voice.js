//const ytdlVideo = require('ytdl-core');
const ytdl = require('ytdl-core-discord');
const streamOptions = { volume: 0.15, passes: 3 };
let dispatcher = false;
class Voice {
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
            if(message.member != null){
                    if(message.content === '!playtest'){
                        if (message.member.voiceChannel) {
                            message.member.voiceChannel.join()
                            .then( connection => {
                                const stream = ytdl('https://www.youtube.com/watch?v=XAWgeLF9EVQ', { filter : 'audioonly' })
                                dispatcher = connection.playStream(stream, streamOptions);
                                dispatcher.volume = 0.2;
                                dispatcher.volumeLogarithmic = 0.2;
                            })
                            .catch(console.error);
                        } else {
                            message.reply('You need to join a voice channel first!');
                        };
                    } else {
                        if (message.member.voiceChannel) {
                            let url = message.content.substring(6,message.content.length);
                            message.member.voiceChannel.join()
                            .then( connection => {
                                async function play(connection, url) {
                                    const stream = ytdl(url)
                                    dispatcher = connection.playOpusStream(await stream, streamOptions);
                                    dispatcher.on('debug', (info) => {
                                        console.log(info);
                                    });
                                    dispatcher.on('error', (info) => {
                                        console.log(info);
                                    });
                                    dispatcher.on('end', (reason) => {
                                        console.log(reason);
                                    });
                                }
                            play(connection,url)
                            })
                            .catch(console.error);
                        } else {
                            message.reply('You need to join a voice channel first!');
                        }; 
                    };
                } else {
                    const current = message.author;
                    current.send(`Stop typying me in pm :angry: `);
                };
        };
        Stream(message){
            if(message.member != null){
                if (message.member.voiceChannel) {
                    let url = message.content.substring(8,message.content.length);
                    message.member.voiceChannel.join()
                    .then( connection => {
                        async function play(connection, url) {
                            dispatcher = connection.playOpusStream(await ytdl(url), streamOptions);
                                dispatcher.on('debug', (info) => {
                                    console.log('debug');
                                    console.log(info);
                                });
                                dispatcher.on('error', (info) => {
                                    console.log('error');
                                    console.log(info);
                                });
                                dispatcher.on('end', (reason) => {
                                    console.log('end');
                                    console.log(reason);
                                });
                        }
                        play(connection, url);
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
        Pause(message) {
            if (message.member.voiceChannel && dispatcher != false) {
                dispatcher.pause();
            };
        };
        Resume(message) {
            if (message.member.voiceChannel && dispatcher != false) {
                dispatcher.resume();
            };
        };
        End(message){
            if (message.member.voiceChannel && dispatcher != false) {
                dispatcher.end();
            };
            
        };
        changeVolume(message){
            if (message.member.voiceChannel && dispatcher != false){
                var volume = message.content.substring(8,message.content.length); 
                console.log(volume);
                dispatcher.setVolume(parseFloat(volume));
            };
        }
}
module.exports = Voice;