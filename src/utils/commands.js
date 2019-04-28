/* eslint-disable no-undef */
const config = require("../../config/config");
const Replies = require("../actions/Replies");
const Voice = require("../actions/Voice.js");
const Moves = require("../actions/Moving");
const Admin = require("../actions/Admin/AdminRights");
const AdminText = require("../actions/Admin/AdminText");
const moving = new Moves();
const voice = new Voice();
const replies = new Replies();
const adminText = new AdminText();
const admin = new Admin();

global.classes = {
  Voice: voice,
  Replies: replies,
  Moving: moving,
  AdminText: adminText,
  Admin: admin
};

let commands = new Map();

config.Commands.forEach((item, index) => {
  switch (index) {
    case 0:
      commands.set(classes.Admin, item);
      break;
    case 1:
      commands.set(classes.Moving, item);
      break;
    case 2:
      commands.set(classes.Voice, item);
      break;
    case 3:
      commands.set(classes.AdminText, item);
      break;
    case 4:
      commands.set(classes.Replies, item);
      break;
  }
});

module.exports = commands;
