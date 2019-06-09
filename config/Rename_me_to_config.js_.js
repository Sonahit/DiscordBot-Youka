/* eslint-disable no-undef */
module.exports = {
  token: "YOUR DISCORD APP TOKEN",
  prefix: ">>",
  API_KEY: "YOUR GOOGLE API TOKEN",
  VKAPI: {
    ACCESS_TOKEN: "YOUR TOKEN",
    APP_ID: "YOUR APP VK ID",
    APP_SECRET: "YOUR APP VK SECRET",
    APP_KEY: "YOUR APP VK KEY",
    USER_PARAMS: [
      "photo_id",
      "verified",
      "sex",
      "bdate",
      "city",
      "country",
      "home_town",
      "has_photo",
      "photo_max",
      "photo_max_orig",
      "online",
      "domain",
      "has_mobile",
      "contacts",
      "site",
      "education",
      "universities",
      "schools",
      "status",
      "last_seen",
      "followers_count",
      "common_count",
      "occupation",
      "nickname",
      "relatives",
      "relation",
      "personal",
      "connections",
      "exports",
      "activities",
      "interests",
      "music",
      "movies",
      "tv",
      "books",
      "games",
      "about",
      "quotes",
      "can_post",
      "can_see_all_posts",
      "can_see_audio",
      "can_write_private_message",
      "can_send_friend_request",
      "is_favorite",
      "is_hidden_from_feed",
      "timezone",
      "screen_name",
      "maiden_name",
      "crop_photo",
      "is_friend",
      "friend_status",
      "career",
      "military",
      "blacklisted",
      "blacklisted_by_me"
    ]
  },
  owners: [
    (VanyaSkatilsya = {
      username: "VanyaSkatilsya",
      id: "6312"
    })
  ],
  DJPermission: "DJ",
  ModeratorPermission: "Модератор",
  Priority: ["Админ", "Модератор"],
  Commands: [
    (Admins = [
      "test",
      "kick",
      "mute",
      "unmute",
      "move",
      "disconnect",
      "restart",
      "playtest",
      "IAdmin",
      "IUser"
    ]),
    (Moving = ["moveTo", "follow"]),
    (Voice = [
      "radio",
      "play",
      "stop",
      "resume",
      "join",
      "leave",
      "volume",
      "rerun",
      "skip",
      "queue",
      "playList"
    ]),
    (Default = ["AYAYA", "help", "ping", "author", "time"])
  ],
  RadioList: [
    (BBC1 = {
      name: "BBC radio one",
      URL: "http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p",
      Jenre: "POP | ROCK | LIVE"
    }),
    (StrictlyHouse = {
      name: "Strictly House",
      URL: "http://247house.fm:9500/stream#.mp3",
      Jenre: "SOULFUL HOUSE | DEEP HOUSE | TECH HOUSE | STRICTLY HOUSE"
    })
  ],
  ValidRoles: [
    "Krabik",
    "Undertale",
    "BOT",
    "BOT_ADMIN",
    "Модератор",
    "DJ",
    "Админ",
    "Уточка",
    "Рабы",
    "Вальхалла"
  ]
};
