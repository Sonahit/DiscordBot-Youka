import winston from "winston";
import { Middleware } from "src/Contracts/Middleware";

declare global {
  namespace NodeJS {
    interface Global {
      logger: winston.Logger;
    }
  }
  var logger: winston.Logger;
  interface IteratorYouka<T, TReturn, TNext> extends Iterator<T, TReturn, TNext> {
    hasNext(): boolean;
  }
}

declare module "yooka-bot" {
  export type YUser = {
    username: string;
    discriminator: string;
    id: string;
  };

  export type Radio = {
    name: string;
    URL: string;
    jenre: string;
  };

  export interface RemindUser {
    time: number;
    user: {
      id: string;
      name: string;
    };
  }

  export interface Config {
    token: string;
    prefix: string;
    whitelist: Array<YUser>;
    blacklist: Array<YUser>;
    radioList: Array<Radio>;
    middlewares: Array<Middleware>;
    queueSize?: number;
  }
}
