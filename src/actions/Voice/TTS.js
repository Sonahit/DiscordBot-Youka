/* eslint-disable no-undef */
const speaker = require("@google-cloud/text-to-speech");
const fs = require("fs");
const config = global.Validation.config;
const util = require("util");
const DetectLanguage = require("detectlanguage");
class TTS {
  async speak(msg, data) {
    if (!data.dispatcher) {
      const client = new speaker.TextToSpeechClient({
        projectId: config.Google.cridentials.project_id,
        keyFilename: config.Google.cridentials.path
      });
      const text = msg.content.split(`${config.prefix}TTS`)[1];
      if (text) {
        const detectLanguage = new DetectLanguage({
          key: config.DETECT_LANGUAGE_API,
          ssl: true
        });
        const language = detectLanguage.detect(text, (error, result) => {
          if (error) {
            console.log(error);
            return;
          }
          return result;
        });
        const request = {
          input: { text: text },
          // Select the language and SSML Voice Gender (optional)
          voice: {
            languageCode: "ru-RU" || language,
            ssmlGender: "NEUTRAL"
          },
          // Select the type of audio encoding
          audioConfig: { audioEncoding: "MP3" }
        };
        const [response] = await client.synthesizeSpeech(request);
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(
          `${__dirname}/output.mp3`,
          response.audioContent,
          "binary"
        );
        msg.member.voice.channel.join().then(async connection => {
          data.dispatcher = await connection.play(`${__dirname}/output.mp3`);
          data.dispatcher.on("end", async reason => {
            const files = fs.readdirSync(`${__dirname}`);
            const exists = files.some(file => {
              return file === "output.mp3";
            });
            if (reason === "force") {
              await connection.disconnect();
            }
            if (exists) {
              fs.unlink(`${__dirname}/output.mp3`, err => {
                if (err) {
                  console.error(err);
                  return;
                }
              });
            }
            data.dispatcher = false;
            console.log("TTS done");
          });
        });
      }
    } else {
      msg.reply("Cannot do that atm");
    }
  }
}

const tts = new TTS();

module.exports = tts;
