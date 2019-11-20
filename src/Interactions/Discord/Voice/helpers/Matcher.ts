export function parseIntoId(playlistURL: string = "") {
  let url = playlistURL.trim();
  url = url.substring(url.indexOf("list=") + "list=".length, url.length);
  const id = url.split("&")[0];
  return id;
}

export function isListURL(playlistURL: string) {
  return /https|www|youtube|com/gi.test(playlistURL);
}

export function isPlayingMusic(music = false, radio = false) {
  return music || radio;
}
