import { App } from "./core/App";
import dotenv from "dotenv";
import path from "path";
import { Logger } from "./core/Logger";
import Loader from "./core/Loader";
import rootPath from "./utils/rootPath";
import config from "./utils/config";

dotenv.config({ path: rootPath(".env") });

const app = new App(config("config"));
const loader = new Loader();

global.logger = Logger.initLogger();

(async () => {
  const commands = await loader.loadDirectory(path.resolve(__dirname, "commands"));
  commands.forEach((command) => command && app.commandRegistrant.register(command));
  app.start();
})();
