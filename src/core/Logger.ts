import logger, { format, LoggerOptions } from "winston";
// Configure logger settings
const { combine, timestamp } = format;
export class Logger {
  static logger: any;
  public static initLogger(options: LoggerOptions | null = null): any {
    if (options) {
      logger.configure(options);
    }
    logger
      .add(
        new logger.transports.File({
          dirname: "./storage/logs",
          filename: `access.log`,
        })
      );
    logger.level = "info";
    Logger.logger = logger;
    return logger;
  }
}
