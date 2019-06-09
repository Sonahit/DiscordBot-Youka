const config = require("../../config/config");
const Validation = require("../Validation");
global.Validation = new Validation();
const Replies = require("../actions/Replies");
const Voice = require("../actions/Voice/Voice");
const Moving = require("../actions/Moving");
const AdminRights = require("../actions/Admin/AdminRights");
global.Replies = new Replies();
global.Voice = new Voice();
global.Moving = new Moving();
global.AdminRights = new AdminRights();
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
