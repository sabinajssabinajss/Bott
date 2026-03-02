module.exports = {
  config: {
    name: "owner",
    version: "1.8",
    author: "LIKHON AHMED",
    countDown: 5,
    role: 0,
    shortDescription: "Show owner info",
    longDescription: "Shows detailed owner information",
    category: "info",
    guide: {
      en: "{p}owner - Show owner info\nOr just type 'owner' without prefix"
    }
  },

  onStart: async function({ message }) {
    const ownerInfo = 
`╭─━━━━━━━━━━━━━━━━━━━─╮
┃     𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 👤     ┃
┃━━━━━━━━━━━━━━━━━━━┃
┃ 💳 𝐍𝐀𝐌𝐄 : 𝐋𝐈𝐊𝐇𝐎𝐍 𝐀𝐇𝐌𝐄𝐃
┃
┃ 🏡 𝐀𝐃𝐃𝐑𝐄𝐒𝐒 : 𝐃𝐇𝐀𝐊𝐀
┃
┃ ☣ 𝐆𝐄𝐍𝐃𝐄𝐑 : 𝐌𝐀𝐋𝐄
┃
┃ 🧬 𝐀𝐆𝐄 : 𝟏𝟖+
┃
┃ 🗿 𝐍𝐈𝐂𝐊𝐍𝐀𝐌𝐄 : 𝐇𝐈𝐌𝐔
┃━━━━━━━━━━━━━━━━━━━━━┃
┃
┃ ✒ 𝐉𝐎𝐁 : 𝐁𝐎𝐓 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑
┃
┃ 📝 𝐄𝐌𝐀𝐈𝐋 : 𝐌𝐀𝐗𝐉𝐈𝟗@𝐏𝐑𝐎𝐍.𝐌𝐄
┃
┃ 🖥 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 : 𝟎𝟏𝟕𝟔𝟏𝟖𝟑𝟖𝟑𝟏𝟔
┃
┃━━━━━━━━━━━━━━━━━━━┃
┃ 🤸‍♀ 𝐁𝐎𝐓 𝐃𝐄𝐕 𝐁𝐘 𝐋𝐈𝐊𝐇𝐎𝐍
╰─━━━━━━━━━━━━━━━━━━━─╯`;

    return message.reply(ownerInfo);
  },

  onChat: async function({ event, message }) {
    try {
      if (!event.body) return;
      
      if (event.body.toLowerCase() === "owner") {
        const ownerInfo = 
`╭─━━━━━━━━━━━━━━━━━━━─╮
┃     𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 👤     ┃
┃━━━━━━━━━━━━━━━━━━━┃
┃ 💳 𝐍𝐀𝐌𝐄 : 𝐋𝐈𝐊𝐇𝐎𝐍 𝐀𝐇𝐌𝐄𝐃
┃
┃ 🏡 𝐀𝐃𝐃𝐑𝐄𝐒𝐒 : 𝐃𝐇𝐀𝐊𝐀
┃
┃ ☣ 𝐆𝐄𝐍𝐃𝐄𝐑 : 𝐌𝐀𝐋𝐄
┃
┃ 🧬 𝐀𝐆𝐄 : 𝟏𝟖+
┃
┃ 🗿 𝐍𝐈𝐂𝐊𝐍𝐀𝐌𝐄 : 𝐇𝐈𝐌𝐔
┃━━━━━━━━━━━━━━━━━━━━━┃
┃
┃ ✒ 𝐉𝐎𝐁 : 𝐁𝐎𝐓 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑
┃
┃ 📝 𝐄𝐌𝐀𝐈𝐋 : 𝐌𝐀𝐗𝐉𝐈𝟗@𝐏𝐑𝐎𝐍.𝐌𝐄
┃
┃ 🖥 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 : 𝟎𝟏𝟕𝟔𝟏𝟖𝟑𝟖𝟑𝟏𝟔
┃
┃━━━━━━━━━━━━━━━━━━━┃
┃ 🤸‍♀ 𝐁𝐎𝐓 𝐃𝐄𝐕 𝐁𝐘 𝐋𝐈𝐊𝐇𝐎𝐍
╰─━━━━━━━━━━━━━━━━━━━─╯`;

        return message.reply(ownerInfo);
      }
    } catch (error) {
      console.error("Owner command error:", error);
    }
  }
};
