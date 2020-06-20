import { App } from "@core/App";
import dotenv from "dotenv";
import path from "path";
import rootPath from "@core/utils/rootPath";
import config from "@core/utils/config";
import { Config } from "yooka-bot";

dotenv.config({ path: rootPath(".env") });
const configData: Config = config("config");

const app = new App(configData);
app.fetchCommands(path.resolve(__dirname, "commands"));
app.start();
