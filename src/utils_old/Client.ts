import Discord from "discord.js";
const client = new Discord.Client() as Client;

interface Client extends Discord.Client {
  queue?: any;
  subscription?: any;
}

export default client;
