const config = require("../../config/config");
global.Validation = require("../Validation");
global.Replies = require("../actions/Replies");
global.Voice = require("../actions/Voice");
global.Moving = require("../actions/Moving");
global.AdminRights = require("../actions/Admin/AdminRights");
const commands = new Map();

config.Commands.forEach((item, index) => {
  switch (index) {
    case 0:
      commands.set("Admin", item);
      break;
    case 1:
      commands.set("Moving", item);
      break;
    case 2:
      commands.set("Voice", item);
      break;
    case 3:
      commands.set("Replies", item);
      break;
  }
});

module.exports = commands;
