module.exports.permissions = {
  adminRights: this.adminRights,
  moderRights: this.moderationRights,
  voiceRights: this.voiceRights,
  commonRights: this.commonRights
};

module.exports.adminRights = ["Админ", "BOT_ADMIN"];
module.exports.moderationRights = ["Модератор", "Админ", "BOT_ADMIN"];
module.exports.voiceRights = ["DJ", "Админ", "BOT_ADMIN"];
module.exports.commonRights = [
  "Модератор",
  "DJ",
  "Уточка",
  "Рабы",
  "Вальхалла",
  "Krabik",
  "Undertale",
  "BOT",
  "Админ",
  "BOT_ADMIN"
];
