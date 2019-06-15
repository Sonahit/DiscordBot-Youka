const config = require("../../config/config");
const Validation = require("../Validation");
global.Validation = new Validation();
const Replies = require("../actions/Replies");
const Voice = require("../actions/Voice/Voice");
const Moving = require("../actions/Moving");
const AdminRights = require("../actions/Admin/AdminRights");
const replies = new Replies();
const voice = new Voice();
const moving = new Moving();
const adminRights = new AdminRights();
const commands = new Map();

config.Commands.forEach((item, index) => {
  switch (index) {
    case 0:
      commands.set(adminRights, item);
      break;
    case 1:
      commands.set(moving, item);
      break;
    case 2:
      commands.set(voice, item);
      break;
    case 3:
      commands.set(replies, item);
      break;
  }
});

module.exports = commands;
