import fs from "fs";
import BaseCommand from "./BaseCommand";
import flat from "src/utils/flat";

export default class Loader {
  async loadDirectory(path: string): Promise<Array<BaseCommand | void>> {
    if (fs.existsSync(path)) {
      let commands = [] as any[];
      const resources = fs.readdirSync(path);
      for (const file of resources) {
        if (this.isDir(`${path}/${file}`)) {
          commands = commands.concat((await this.loadDirectory(`${path}/${file}`)).flat());
        } else {
          commands = commands.concat(await this.loadFile(`${path}/${file}`));
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

  async loadFile(path: string): Promise<void | BaseCommand> {
    if (fs.existsSync(path)) {
      const classFile = await import(path);
      const instance = new classFile.default();
      if (instance instanceof BaseCommand) {
        return instance;
      }
    }
  }
}
