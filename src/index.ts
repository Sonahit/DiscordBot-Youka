import Bot from "./Bot";
import client from "./utils/Client";
import config from "../config/config";

const bot = new Bot(client, config);
bot.initBot(bot.client);
bot.initHandlers();

global.validator = bot.validator;
