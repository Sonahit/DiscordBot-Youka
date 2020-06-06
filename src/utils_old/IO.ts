import fs from "fs";
import path from "path";
import { RemindUser, IPermissions } from "yooka-bot";
import { NO_PERMISSIONS } from "@handlers/Discord/RolesPermissions";

class IO {
  remindToFile(pathDirFile: string, data: RemindUser) {
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
              lastRemind: new Date().getTime(),
            },
          };
        } else {
          const fileData = fs.readFileSync(pathToFile, "utf8");
          if (fileData) {
            currentData = JSON.parse(fileData);
            currentData[data.user.id] = {
              name: data.user.name,
              remind: true,
              interval: data.time,
              lastRemind: new Date().getTime(),
            };
          } else {
            currentData = {
              [data.user.id]: {
                name: data.user.name,
                remind: true,
                interval: data.time,
                lastRemind: new Date().getTime(),
              },
            };
          }
        }
        fs.writeFileSync(pathToFile, JSON.stringify(currentData));
        fs.close(fd, (err) => {
          if (err) throw err;
        });
      });
    } else {
      fs.mkdirSync(dir);
    }
  }

  readPermissions(path: string): IPermissions {
    try {
      const data = JSON.parse(fs.readFileSync(path).toString());
      if (!data) return NO_PERMISSIONS;
      return data as IPermissions;
    } catch (err) {
      return NO_PERMISSIONS;
    }
  }

  updatePermission(path: string, permissions: IPermissions): Promise<boolean | IPermissions> {
    return new Promise((resolve, reject) => {
      fs.open(path, "r", (err, fd) => {
        if (err) return reject(err);
        const fileData: IPermissions | undefined = JSON.parse(fs.readFileSync(path, "utf8").toString());
        return resolve();
      });
    })
      .then(() => {
        fs.writeFileSync(path, JSON.stringify(permissions, null, 4));
        return permissions;
      })
      .catch((err: any) => {
        logger.error(err);
        return false;
      });
  }
}

export default IO;
