import fs from "fs";
import BaseCommand from "./BaseCommand";
import flat from "@core/utils/flat";

export default class Loader {
  loadDirectory(path: string): Array<BaseCommand> {
    if (fs.existsSync(path)) {
      let commands = [] as any[];
      const resources = fs.readdirSync(path);
      for (const file of resources) {
        if (this.isDir(`${path}/${file}`)) {
          commands = commands.concat(this.loadDirectory(`${path}/${file}`).flat());
        } else {
          commands = commands.concat(this.loadFile(`${path}/${file}`));
        }
      }
      return commands;
    }
    return [];
  }

  isDir(path: string): boolean {
    if (fs.existsSync(path)) {
      return fs.lstatSync(path).isDirectory();
    }
    return false;
  }

  loadFile(path: string): BaseCommand | void {
    if (fs.existsSync(path)) {
      const classFile = require(path);
      const instance = new classFile.default();
      if (instance instanceof BaseCommand) {
        return instance;
      }
    }
  }
}
