import { App } from "@core/App"
import { RedisClient } from "redis";

export default () : RedisClient => {
  return App.getInstance().redisConnection.getConnection();
}
