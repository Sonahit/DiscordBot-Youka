const config = require("../../config/config");
const Replies = require("../actions/Replies");
const Voice = require("../actions/Voice.js");
const Moves = require("../actions/Moving");
const Admin = require("../actions/AdminRights");
const Text = require("../actions/Text");
const moving = new Moves();
const voice = new Voice();
const replies = new Replies();
const text = new Text();
const admin = new Admin();

global.classes = {
  Voice: voice,
  Replies: replies,
  Moving: moving,
  Text: text,
  Admin: admin
}

let commands = new Map();

config.Commands.forEach((item, index) => {
  switch (index) {
    case 0:
      commands.set(classes.Admin, item);
    case 1:
      commands.set(classes.Moving, item);
    case 2:
      commands.set(classes.Voice, item);
    case 3:
      commands.set(classes.Text, item);
    case 4:
      commands.set(replies, item);
  }
});

module.exports = commands;
