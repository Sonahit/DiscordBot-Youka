const { client, Attachment } = require('discord.js');
const config = require('../../config/config');

class Replies{
        Start(msg){
                const current = msg.author;
                current.send(`...Started!`);
        }
        Pong(msg){
                msg.reply('Pong!');
        }
        Relog(msg){
                const current =  msg.author;
                current.send(`You need to restart bot!`);
        }
        Restart(msg){
                const current = msg.author;
                current.send(`...Restarting`);
        }
        Error(msg){
                const current = msg.author;
                current.send(`You are not owner of this bot!`);
                current.send(`Stop trying to destroy not your stuff!`);
                current.send(":japanese_goblin:");
        }
        async Help(msg){
                const attachment = new Attachment('https://discordemoji.com/assets/emoji/AYAYA.png');
                const current =  msg.author;
                const emoji = ":cry:"
                await current.send(attachment);
                if( isAuthor(msg) ){
                        current.send(`
                        You said you need ?HELP?
                        ${emoji.repeat(8)}
                        **               Available commands:                           ** 
                        ** AYAYA:               AYAYA                                   **                         
                        ** !join:               Joins your channel                      ** 
                        ** !leave:              Leaves your channel                    ** 
                        ** !ping:               Types a reply pong                      ** 
                        ** !play                https://[url]: Plays a video             ** 
                        ** !stream              https://[url]: Plays a youtube stream  ** 
                        ** !pause:              Pause playing video                    ** 
                        ** !resume:             Resumes playing video                 ** 
                        ** !end:                Ends playing video                       ** 
                        ** !move to me:         Moves bot to you                      **
                        ** !move(To):           Get all channels and their ids        **
                        ** !move(To) #:         Moving bot to # Channel               **
                        ** !move(To) name #:    Moving {name} to # Channel     **
                        ** !disconnect:         Shutdowns bot                     ** 
                        ** !restart:            Restarts bot                         ** 
                        ** !help:               Get help                                **` );
                        return;
                } 
                if ( isDj(msg) ){
                        current.send(`
                        You said you need ?HELP?
                        ${emoji.repeat(8)}
                        **               Available commands:                           ** 
                        ** AYAYA:               AYAYA                                   **                         
                        ** !join:               Joins your channel                      ** 
                        ** !leave:              Leaves your channel                    ** 
                        ** !ping:               Types a reply pong                      ** 
                        ** !play                https://[url]: Plays a video             ** 
                        ** !stream              https://[url]: Plays a youtube stream  ** 
                        ** !pause:              Pause playing video                    ** 
                        ** !resume:             Resumes playing video                 ** 
                        ** !end:                 Ends playing video                       ** 
                        ** !move to me:         Moves bot to you                      **
                        ** !move(To):           Get all channels and their ids        **
                        ** !move(To) #:         Moving bot to # Channel               **
                        ** !move(To) name #:    Moving {name} to # Channel     **
                        ** !help:               Get help                                **` );
                        return;
                }
                current.send(`
                You said you need ?HELP?
                ${emoji.repeat(8)}
                ** Available commands:                           ** 
                ** AYAYA: AYAYA                                   **                         
                ** !ping: Types a reply pong                      ** 
                ** !help: Get help                                **
                ** !move to me:         Moves bot to you                      **` );
                return;
        }
        AYAYA(msg){
                const current =  msg.channel;
                current.send('AYAYA');
                current.send('https://discordemoji.com/assets/emoji/AYAYA.png');
        }
        Time(msg){
                const current =  msg.channel;
                current.send("Current time:\n" + this.getMonth() + "\t:\t"  + this.getDay() +"\n\t"+ new Date().getHours() +":"+ new Date().getMinutes() );
        }
        getDay(){
                switch(new Date().getDay()){
                case(1): 
                        return "Monday";
                case(2): 
                        return "Tuesday";
                case(3):
                        return "Wednesday";
                case(4):
                        return "Thursday";
                case(5):
                        return "Friday";
                case(6):
                        return "Saturday";
                case(7): 
                        return "Sunday";
                }
        }
        getMonth(){
                switch(new Date().getMonth()){
                case(0): 
                        return "January";
                case(1): 
                        return "February";
                case(2): 
                        return "March";
                case(3):
                        return "April";
                case(4):
                        return "May";
                case(5):
                        return "June";
                case(6):
                        return "July";
                case(7):
                        return "August";
                case(8):
                        return "September";
                case(9):
                        return "October";
                case(10):
                        return "November";
                case(11): 
                        return "December";
                }
        }
}
function isAuthor(msg){
        return msg.author.client.user.username.indexOf(config.owners) 
        && msg.author.client.user.discriminator.indexOf(config.owners)
      }
      
function isDj(msg){
        return msg.author.client.user.username.indexOf(config.djs) 
        && msg.author.client.user.discriminator.indexOf(config.djs)
      }
      
function validateURL(msg){
        let pattern = /!(play|stream)\s*http.:[//]+www[.]youtube[.]com[/]watch.+/gi
        let check = pattern.test(msg)
        return check;
      }
module.exports = Replies;