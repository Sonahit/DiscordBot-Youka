import ytd, { videoInfo } from "ytdl-core";

export type Music = {
  id: string;
  url: string;
  videoInfo: videoInfo;
};
