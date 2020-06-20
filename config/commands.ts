import rootPath from "@utils/rootPath";
import env from "@utils/env";

export default {
  'folder': env('COMMANDS_PATH', rootPath('src.commands'))
}
