import fs from "fs";
import path from "path";
import { RemindUser } from "yooka-bot";

class RemindIO {
  remindToFile(pathDirFile: string, data: RemindUser) {
    // eslint-disable-next-line no-undef
    const dir = path.resolve(pathDirFile, "user_data");
    if (fs.existsSync(dir)) {
      const pathToFile = `${pathDirFile}/remind.json`;
      fs.open(pathToFile, "r", (err, fd) => {
        let currentData;
        if (err) {
          currentData = {
            [data.user.id]: {
              name: data.user.name,
              remind: true,
              interval: data.time,
              lastRemind: new Date().getTime()
            }
          };
        } else {
          const fileData = fs.readFileSync(pathToFile, "utf8");
          if (fileData) {
            currentData = JSON.parse(fileData);
            currentData[data.user.id] = {
              name: data.user.name,
              remind: true,
              interval: data.time,
              lastRemind: new Date().getTime()
            };
          } else {
            currentData = {
              [data.user.id]: {
                name: data.user.name,
                remind: true,
                interval: data.time,
                lastRemind: new Date().getTime()
              }
            };
          }
        }
        fs.writeFileSync(pathToFile, JSON.stringify(currentData));
        fs.close(fd, err => {
          if (err) throw err;
        });
      });
    } else {
      fs.mkdirSync(dir);
    }
  }
}

export default RemindIO;
