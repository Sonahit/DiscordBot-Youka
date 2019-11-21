import Bot from "./Bot";
import client from "./utils/Client";
import config from "../config/config";
import path from "path";

const pathToPermissinos = path.resolve(__dirname, "../config/permissions.json");
const bot = new Bot(client, config, pathToPermissinos);

bot
  .initBot(bot.client)
  .initHandlers()
  .initOnExit();

global.validator = bot.validator;
global.permissions = bot.permissions.permissions;
