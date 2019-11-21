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

  private async updatePermission(newPermissions: IPermissions): Promise<boolean> {
    const result = await io.updatePermission(this.path, newPermissions);
    if (!result) return false;
    return true;
  }

  async addPermission(msg: Message): Promise<void> {
    const { role, level } = this.fetchRole(msg.content);
    const permissions = Object.assign({}, this.rolesPermission);
    if (!Object.keys(permissions).includes(level)) {
      msg.reply("No such level");
      return;
    }
    permissions[level].push(role);
    const result = await this.updatePermission(permissions);
    if (!result) return;
    this.rolesPermission = Object.assign({}, permissions);
  }

  async deletePermission(msg: Message): Promise<void> {
    const { role } = this.fetchRole(msg.content);
    const permissions = Object.assign({}, this.rolesPermission);
    const filteredPermissions = Object.keys(permissions).reduce((filtered, level) => {
      filtered[level] = permissions[level].filter(v => v !== role);
      return filtered;
    }, {} as { [key: string]: any }) as IPermissions;
    const result = await this.updatePermission(filteredPermissions);
    if (!result) return;
    this.rolesPermission = Object.assign({}, filteredPermissions);
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
        embed.addField(`${level[0].toUpperCase() + level.substring(1, level.length)}`, "No data");
      } else {
        embed.addField(`${level[0].toUpperCase() + level.substring(1, level.length)}`, entries.join(", "));
      }
    });
    msg.reply(embed);
  }

  private fetchRole(msgContent: string) {
    const regex = new RegExp(`^${config.prefix}\\w+\\s`, "i");
    const content = msgContent.split(regex)[1].split(" ");
    const [role, level] = content;
    if (!level) return { role, level };
    return { role, level: level.toLowerCase() };
  }

  whatPermissions(handlerName: string): string[] {
    if (!Object.keys(config.commands).indexOf(handlerName)) return this.rolesPermission.common;
    if (handlerName === "AdminCommands") return this.rolesPermission.moderation;
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
