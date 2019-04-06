module.exports = class AdminRights {
  constructor(mode = "user") {
    this.mode = mode;
  }
  getMode() {
    return this.mode;
  }

  setMode(mode) {
    this.mode = mode;
  }

  Kick(msg) {
    if (this.mode === "admin") {
    } else {
    }
  }

  Ban(msg) {
    if (this.mode === "admin") {
    } else {
    }
  }

  Mute(msg) {
    if (this.mode === "admin") {
    } else {
    }
  }
};
