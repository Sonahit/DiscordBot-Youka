import { Config } from "yooka-bot";
import env from "src/utils/env";

const config: Config = {
  token: env("TOKEN"),
  prefix: env("PREFIX"),
};

export default config;
