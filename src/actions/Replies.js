const { client, Attachment } = require('discord.js');

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
        current.send('You said you need ?HELP?');
        current.send(emoji);
        current.send('Available commands:');
        current.send('!join: Joins your channel');
        current.send('!leave: Leaves your channel');
        current.send('!ping: Types a reply "pong"');
        current.send('!play https://[url]: Plays a video');
        current.send('!pause: Pause playing video');
        current.send('!resume: Resumes playing video');
        current.send('!end: Ends playing video');
        current.send('!help: Get help');
    }
    AYAYA(msg){
        const current =  msg.channel;
        current.send('AYAYA');
        current.send('https://discordemoji.com/assets/emoji/AYAYA.png');
    }
    Time(msg){
        const current =  msg.channel;
        current.send("Current time: "+ this.getMonth() + " : " + this.getDay() +" : "+ new Date().getHours() + " : " + new Date().getMinutes() );
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

module.exports = Replies;