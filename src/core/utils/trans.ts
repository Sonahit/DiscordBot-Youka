import rootPath from "./rootPath";
import config from "./config";
import { ConfigNotFoundException } from "@core/exceptions/ConfigNotFoundException";

/**
 *
 * @param subject Path that relative /lang directory. Can be separated with dots
 * @param replace
 *
 */
const trans = (subject: string, replace: { [key: string]: string } = {}): string => {
  const path = subject.split(".");
  const file = path[0];
  const langConfig = path.filter((v, i) => i > 0);
  const langPath = rootPath("src.lang");
  const lang = config("lang.default");
  let langFile: any;
  try {
    langFile = require(`${langPath}/${lang}/${file}`).default;
  } catch (err) {
    throw new ConfigNotFoundException(trans("system.config_not_found"));
  }
  let translation = langConfig.reduce((acc, key) => (acc = langFile[key]), "") || "";
  Object.entries(replace).forEach(([key, v]) => {
    translation = translation.replace(`:${key}`, v);
  });
  return translation;
};

export default trans;
