const https = require('https');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "info",
    aliases: ["inf2", "in42"],
    version: "2.0",
    author: "nirob ~> Logic Update LIKHON AHMED",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Sends information about the bot and admin."
    },
    category: "Information"
  },

  onStart: async function({ message, api }) {
    await this.sendInfo(message, api);
  },

  onChat: async function({ event, api }) {
    const body = (event.body || "").toLowerCase();
    if (body === "/info" || body === "info") {
      await this.sendInfo({ threadID: event.threadID, senderID: event.senderID }, api);
    }
  },

  sendInfo: async function(messageObj, api) {
    const botName = "𝐎𝐘𝐨𝐧 ꨄ︎";
    const botPrefix = "/";
    const authorName = "𝐋𝐈𝐊𝐇𝐎𝐍 𝐀𝐇𝐌𝐄𝐃";
    const authorFB = "@𝐥𝐢𝐤𝐡𝐨𝐧𝐚𝐡𝐦𝐞𝐝𝟎𝟎𝟗";
    const authorInsta = "𝐧𝐨𝐭𝐢𝐧𝐬𝐭𝐚𝟔𝐓𝟗";
    const status = "𝐌𝐢𝐬𝐬𝐢𝐧𝐠 𝐃𝐞𝐚𝐫 🫠🎀";
    const uid = "61572915213085";
    const accessToken = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

    const profilePicUrl = `https://graph.facebook.com/${uid}/picture?height=720&width=720&access_token=${accessToken}`;

    const now = moment().tz('Asia/Dhaka');
    const time = now.format('h:mm:ss A');

    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const uptimeString = `${hours}h ${minutes}m ${seconds}sec`;

    const messageBody = `╭────────────◊
├‣ 𝐁𝐨𝐭 & 𝐎𝐰𝐧𝐞𝐫 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧
├‣ 𝐍𝐚𝐦𝐞: ${authorName}
├‣ 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞: ${botName}
├‣ 𝐏𝐫𝐞𝐟𝐢𝐱: ${botPrefix}
├‣ 𝐅𝐛: ${authorFB}
├‣ 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦: ${authorInsta}
├‣ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩: ${status}
├‣ 𝐓𝐢𝐦𝐞: ${time}
├‣ 𝐔𝐩𝐭𝐢𝐦𝐞: ${uptimeString}
╰────────────◊`;

    api.sendMessage({
      body: messageBody,
      attachment: await global.utils.getStreamFromURL(profilePicUrl)
    }, messageObj.threadID || messageObj.senderID);
  }
};
