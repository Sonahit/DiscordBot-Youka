import { PermissionsHandler, IPermissions } from "yooka-bot";
import { Message, MessageEmbed } from "discord.js";
import config from "../../../config/config";
import IO from "../../utils/IO";
const io = new IO();

const NO_PERMISSIONS: IPermissions = {
  admin: [],
  moderation: [],
  voice: [],
  common: []
};

export { NO_PERMISSIONS };

export default class RolesPermissions implements PermissionsHandler {
  rolesPermission: IPermissions;
  path: string;

  constructor(path: string) {
    this.path = path;
    this.rolesPermission = IO.prototype.readPermissions(path);
  }

  get keysAsArray() {
    return Object.keys(this.rolesPermission);
  }

  private async updatePermission(newPermissions: IPermissions): Promise<boolean> {
    const result = await io.updatePermission(this.path, newPermissions);
    if (!result) return false;
    return true;
  }

  addPermission(msg: Message): void {
    const { roles, level } = this.fetchRole(msg.content);
    const permissions = Object.assign({}, this.rolesPermission);
    const exists = this.keysAsArray.some(k => k.toLowerCase() === level);
    if (!exists) {
      msg.reply("No such level");
      return;
    }
    const intersects = (oldValues: IPermissions, oldKeys: Array<string>, newValues: Array<string>, level: string) => {
      return oldKeys.reduce((acc, key) => {
        if (key === level) {
          acc[key] = newValues.reduce((values, newValue) => {
            if (!values.includes(newValue)) values.push(newValue);
            return values;
          }, acc[key]);
        }
        return acc;
      }, oldValues);
    };

    const duplicates = (oldValues: IPermissions, newValues: Array<string>, level: string) => {
      return newValues.reduce((acc, value) => {
        if (oldValues[level].includes(value) && !acc.includes(value)) {
          acc.push(value);
        }
        return acc;
      }, [] as Array<string>);
    };
    const filteredPermissions = intersects(permissions, this.keysAsArray, roles, level);
    if (!filteredPermissions) {
      msg.reply(`Roles permission ${roles.join(", ")} already exists in permissions`);
      return;
    }
    const result = this.updatePermission(filteredPermissions);
    if (!result) return;
    this.rolesPermission = Object.assign({}, filteredPermissions);
    msg.reply(`Succefully added roles ${duplicates(filteredPermissions, roles, level).join(", ")} to ${this.firstUpper(level)}`);
  }

  private firstUpper(string: string) {
    return string[0].toUpperCase() + string.substring(1, string.length);
  }

  deletePermission(msg: Message): void {
    const { roles } = this.fetchRole(msg.content);
    const permissions = Object.assign({}, this.rolesPermission);
    const filteredPermissions = Object.keys(permissions).reduce((filtered, level) => {
      filtered[level] = permissions[level].filter(v => roles.every(r => v !== r));
      return filtered;
    }, {} as { [key: string]: any }) as IPermissions;
    const result = this.updatePermission(filteredPermissions);
    if (!result) return;
    this.rolesPermission = Object.assign({}, filteredPermissions);
    msg.reply(`Deleted ${roles.join(", ")}`);
  }

  async hierarchy(msg: Message): Promise<void> {
    const embed = new MessageEmbed();
    embed
      .setColor("#000")
      .setAuthor(msg.guild?.name, msg.guild?.iconURL() || undefined)
      .setDescription(`Guild ${msg.guild?.name} role permissions`);
    Object.keys(this.rolesPermission).map(level => {
      const entries = this.rolesPermission[level];
      if (entries.length < 1) {
        embed.addField(`${this.firstUpper(level)}`, "No data");
      } else {
        embed.addField(`${this.firstUpper(level)}`, entries.join(", "));
      }
    });
    msg.reply(embed);
  }

  private fetchRole(msgContent: string) {
    const regex = new RegExp(`^${config.prefix}\\w+\\s`, "i");
    const content = msgContent.split(regex)[1].split(" ");
    const [level, ...roles] = content;
    if (!level) return { roles, level: "common" };
    return { roles, level: level.toLowerCase() };
  }

  whatPermissions(handlerName: string): string[] {
    if (!Object.keys(config.commands).indexOf(handlerName)) return this.rolesPermission.common;
    if (handlerName === "AdminCommands" || handlerName === "RolesPermissions") return this.rolesPermission.moderation;
    if (handlerName === "Voice" || handlerName === "Moving") return this.rolesPermission.voice;
    return this.rolesPermission.common;
  }

  existsInCommon(role = "") {
    return this.rolesPermission.common.some(commonRole => role === commonRole);
  }

  existsInVoice(role = "") {
    return this.rolesPermission.voice.some(voiceRole => role === voiceRole);
  }

  existsInModeration(role = "") {
    return this.rolesPermission.moderation.some(modRole => role === modRole);
  }

  get permissions(): IPermissions {
    return this.rolesPermission;
  }
}
