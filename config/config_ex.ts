import fs from "fs";
import { Config, Radio, HandlersConfig } from "yooka-bot";

const pathToCridentials: string = `${__dirname}\\JSON FILE`;
const googleCridentials = JSON.parse(fs.readFileSync(pathToCridentials).toString());

const commands: HandlersConfig = {
  AdminCommands: [
    "test",
    "kick",
    "disconnect",
    "restart",
    "playtest",
    "IAdmin",
    "IUser",
    "whitelist",
    "show_whitelist",
    "remove_whitelist",
    "blacklist",
    "show_blacklist",
    "remove_blacklist"
  ],
  Moving: ["moveTo", "follow"],
  Voice: ["radio", "play", "stop", "resume", "join", "leave", "volume", "rerun", "skip", "queue", "playlist"],
  Streams: ["stream"],
  Replies: ["AYAYA", "help", "ping", "author", "time"]
};

const radioList: Array<Radio> = [
  {
    name: "BBC radio one",
    URL: "http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p",
    jenre: "POP | ROCK | LIVE"
  },
  {
    name: "Strictly House",
    URL: "http://247house.fm:9500/stream#.mp3",
    jenre: "SOULFUL HOUSE | DEEP HOUSE | TECH HOUSE | STRICTLY HOUSE"
  },
  {
    name: "101Ru.Trap",
    URL: "http://ic4.101.ru:8000/a193?&setst=hlias8p2tuuejojmeritvr2c28&token=TzxQRqtuKNWs05v2p9VGJroMXlYyO7kn",
    jenre: "TRAP"
  }
];

const config: Config = {
  token: "your_token",
  prefix: ">>",
  google: {
    youtubeApiKey: "your_youtube_api_key",
    cridentials: {
      projectId: googleCridentials.project_id,
      path: pathToCridentials
    }
  },
  twitch: {
    api: "https://api.twitch.tv/helix",
    client_id: "your_client_secret",
    client_secret: "your_client_secret"
  },
  whitelist: [
    {
      username: "VanyaSkatilsya",
      discriminator: "6312",
      id: "153544123880701953"
    }
  ],
  blacklist: [],
  commands,
  radioList
};

export default config;
