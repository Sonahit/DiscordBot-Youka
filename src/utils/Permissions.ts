import { Message } from "discord.js";
import config from "../../config/config";

const adminPermissions = ["Админ", "BOT_ADMIN"];
let moderationPermissions = ["Модератор"];
let voicePermissions = ["DJ"];
let commonPermissions = ["Уточка", "Рабы", "Вальхалла", "Krabik", "Undertale", "BOT"];

function setupRoles() {
  for (const admRole of adminPermissions) {
    if (!existsInVoice(admRole)) {
      voicePermissions.push(admRole);
    }
    if (!existsInModeration(admRole)) {
      moderationPermissions.push(admRole);
    }
    if (!existsInCommon(admRole)) {
      commonPermissions.push(admRole);
    }
  }
  for (const modRole of moderationPermissions) {
    if (!existsInVoice(modRole)) {
      voicePermissions.push(modRole);
    }
    if (!existsInCommon(modRole)) {
      commonPermissions.push(modRole);
    }
  }
  for (const voiceRole of voicePermissions) {
    if (!existsInCommon(voiceRole)) {
      commonPermissions.push(voiceRole);
    }
  }
}

function existsInCommon(role = "") {
  return commonPermissions.some(commonRole => role === commonRole);
}

function existsInVoice(role = "") {
  return voicePermissions.some(voiceRole => role === voiceRole);
}

function existsInModeration(role = "") {
  return moderationPermissions.some(modRole => role === modRole);
}

setupRoles();

function whatPermissions(handlerName: string): string[] {
  if (!Object.keys(config.commands).indexOf(handlerName)) return commonPermissions;
  if (handlerName === "AdminCommands") return moderationPermissions;
  if (handlerName === "Voice") return voicePermissions;
  if (handlerName === "Moving") return voicePermissions;
  return commonPermissions;
}

export default {
  adminPermissions: adminPermissions,
  moderPermissions: moderationPermissions,
  voicePermissions: voicePermissions,
  commonPermissions: commonPermissions,
  whatPermissions
};
