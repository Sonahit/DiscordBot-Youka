/* eslint-disable no-undef */
module.exports = {
  token: "YOUR_TOKEN",
  prefix: ">>",
  API_KEY: "YOUR_GOOGLE_API_KEY",
  owners: [
    (VanyaSkatilsya = {
      username: "VanyaSkatilsya",
      id: "6312"
    })
  ],
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
    (AdminText = ["flush", "Tmute", "Tunmute"]),
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