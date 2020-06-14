import rootPath from "./rootPath";
import path from "path";
import { ConfigNotFoundException } from "src/exceptions/ConfigNotFoundException";
import trans from "./trans";

export default (subject: string) => {
  const config = rootPath("config");
  const subjectStructure = subject.trim().split(".");
  const variable = (subjectStructure.length > 1 && subjectStructure[subjectStructure.length - 1]) || "";
  const filePath =
    (variable && subjectStructure.filter((_, i) => i !== subjectStructure.length - 1).join("/")) || subjectStructure[subjectStructure.length - 1];
  let configFile;
  try {
    configFile = require(path.resolve(config, filePath)).default;
  } catch (e) {
    throw new ConfigNotFoundException(trans("system.config_not_found"));
  }
  return variable ? configFile[variable] : configFile;
};
