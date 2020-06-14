import { Config } from "yooka-bot";
import env from "src/core/utils/env";

const config: Config = {
  token: env("TOKEN"),
  prefix: env("PREFIX", ">>"),
  redisHost: env("REDIS_HOST"),
  redisPort: env("REDIS_PORT", 6379),
  redisPassword: env("REDIS_PASSWORD", ""),
};

export default config;
