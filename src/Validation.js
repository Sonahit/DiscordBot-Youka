const config = "../config/config.js";

module.exports = class Validation{
    isAuthor(msg) {
      return (
        msg.author.username.indexOf(config.owners) &&
        msg.author.discriminator.indexOf(config.owners)
      );
    }
  
    isRole(msg, role) {
      let check = false;
      let typingCheck = msg.member;
      if (typingCheck != null) {
        msg.member.roles.forEach(function(item, i, array){
            if (item.name === role) {
                check = true;
              }
            })
        return check;
      } else {
        msg.author.send("Try to type from channel");
      }
    }
    
    validateURL(msg) {
      let pattern = new RegExp(
        `${config.prefix}(play|stream) http.:[//]+www[.]youtube[.]com[/]watch.+`,
        "g"
      );
      let check = pattern.test(msg);
      return check;
    }

    checkBotMove(msg = "") {
        // let pattern = /!(move|moveTo)\s\d+/g
         let pattern = new RegExp(`${config.prefix}(move|moveTo) *[0-9]+`,'g');
         let check = pattern.test(msg);
         return check;
    }    
    checkMoveUser(msg = "") {
        let pattern = /!(move|moveTo)(\s*(\w|[А-Яа-я])+\s[0-9]*)/g;
        //let pattern = new RegExp(`${config.prefix}(move|moveTo) *(\w|[А-Яа-я])+ [0-9]+`,'g')
        let check = pattern.test(msg);
        return check;
    }
  }