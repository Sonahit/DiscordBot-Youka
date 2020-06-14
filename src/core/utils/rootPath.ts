import path from "path";

export default (filePath = "") => {
  const rootPath = process.env.NODE_PATH || process.env.PWD || path.resolve(__dirname, "../../../");
  const dot = filePath.startsWith(".");
  const file = filePath.replace(/\./g, "/");
  const newPath = dot ? "." + file.substr(1) : file;
  return path.resolve(rootPath, newPath);
};
