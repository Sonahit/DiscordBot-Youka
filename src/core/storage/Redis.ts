import redis, { RedisClient } from "redis";
import HasConnection from "@core/contracts/HasConnection";
import { EventEmitter } from "events";

export default class Redis implements HasConnection {
  public connection: RedisClient;

  constructor(options: redis.ClientOpts = {}) {
    this.connection = redis.createClient(options);
  }

  getConnection() {
    return this.connection;
  }
}
