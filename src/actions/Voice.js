const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 0.15 };
let dispatcher;
class Voice {
        Join (message) {
            if (message.member.voiceChannel) {
                message.member.voiceChannel.join()  
                } else {
                message.reply('You need to join a voice channel first!');
                }
        };
        Disconnect (message){
            message.member.voiceChannel.leave();
        };
        Play(message){
            if(message.content === '!playtest'){
                if (message.member.voiceChannel) {
                    message.member.voiceChannel.join()
                    .then( connection => {
                        const stream = ytdl('https://www.youtube.com/watch?v=XAWgeLF9EVQ', { filter : 'audioonly' })
                        dispatcher = connection.playStream(stream, streamOptions);
                    })
                    .catch(console.error);
                } else {
                    message.reply('You need to join a voice channel first!');
                }
            } else {
                if (message.member.voiceChannel) {
                    let url = message.content.substring(6,message.content.length);
                    message.member.voiceChannel.join()
                    .then( connection => {
                        const stream = ytdl(url, { filter : 'audioonly' })
                        dispatcher = connection.playStream(stream, streamOptions);
                    })
                    .catch(console.error);
                } else {
                    message.reply('You need to join a voice channel first!');
                } 
            }
        }
        Pause(message) {
            if (message.member.voiceChannel) {
                dispatcher.pause();
            }
        }
        Resume(message) {
            if (message.member.voiceChannel) {
                dispatcher.resume();
            }
        }
        End(message){
            if (message.member.voiceChannel) {
                dispatcher.end();
            }
            
        }
}
module.exports = Voice;