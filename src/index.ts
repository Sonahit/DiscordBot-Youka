import { App } from "./Core/App";
import config from "../config/config";
import path from "path";
import { Logger } from "./Core/Logger";
import Loader from "./Core/Loader";

const app = new App(config);
const loader = new Loader();

global.logger = Logger.initLogger();
loader
  .loadDirectory(path.resolve(__dirname, "Commands"))
  .then((commands) => {
    commands.forEach((command) => command && app.commandRegistrant.register(command));
  })
  .then(() => app.start());
