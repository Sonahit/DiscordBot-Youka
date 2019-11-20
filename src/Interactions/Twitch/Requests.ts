import https from "https";
import fetch from "node-fetch";

class Requests {
  get(url: string, options: any) {
    return fetch(url, { ...options })
      .then(res => {
        return res.json();
      })
      .catch(err => {
        return err;
      });
  }

  options(host: string, method = "GET", params = {}) {
    return new Promise(resolve => {
      https.request(
        {
          method: method,
          path: host,
          timeout: 3000,
          ...params
        },
        res => {
          let data: any;
          res.on("data", _data => (data += _data));
          res.on("end", () => resolve(data));
        }
      );
    });
  }
}

export default Requests;
