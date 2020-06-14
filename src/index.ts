import { App } from "@core/App";
import dotenv from "dotenv";
import path from "path";
import { Logger } from "@core/Logger";
import Loader from "@core/Loader";
import rootPath from "@core/utils/rootPath";
import config from "@core/utils/config";
import { Config } from "yooka-bot";

dotenv.config({ path: rootPath(".env") });

const configData: Config = config("config");
const app = new App(configData);
const loader = new Loader();

global.logger = Logger.initLogger();

const commands = loader.loadDirectory(path.resolve(__dirname, "commands"));
commands.forEach((command) => app.commandRegistrant.register(command));
app.start();
