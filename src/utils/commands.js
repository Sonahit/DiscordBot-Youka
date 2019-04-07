const config = require("../../config/config");
const Replies = require("../actions/Replies");
const Voice = require("../actions/Voice.js");
const Moves = require("../actions/Moving");
const Admin = require("../actions/AdminRights");
const moving = new Moves();
const voice = new Voice();
const replies = new Replies();
const admin = new Admin();

let commands = new Map();

config.Commands.forEach((item, index) => {
  switch (index) {
    case 0:
      commands.set(admin, item);
    case 1:
      commands.set(moving, item);
    case 2:
      commands.set(voice, item);
    case 3:
      commands.set(replies, item);
  }
});

module.exports = commands;
