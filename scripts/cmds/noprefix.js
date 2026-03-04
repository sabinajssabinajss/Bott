module.exports = {
  config: {
    name: "noprefix",
    version: "1.0.0",
    role: 2,
    author: "MOHAMMAD-BADOL",
    description: "Enable/disable No Prefix mode for all commands",
    category: "system",
    guide: "{pn} on/off",
    countDown: 5
  },

  onStart: async function ({ message, args }) {
    const status = args[0]?.toLowerCase();

    if (status === "on") {
      global.GoatBot.config.noPrefixMode = true;
      return message.reply("✅ No Prefix mode is enabled. All commands will work without prefix now.");
    } else if (status === "off") {
      global.GoatBot.config.noPrefixMode = false;
      return message.reply("❌ No Prefix mode is disabled. Prefix (e.g., /) must be used now.");
    } else {
      return message.reply("Usage: noprefix on or noprefix off");
    }
  }
};

if (!global.GoatBot?.config?.noPrefixMode) {
  if (!global.GoatBot) global.GoatBot = {};
  if (!global.GoatBot.config) global.GoatBot.config = {};
  global.GoatBot.config.noPrefixMode = true;
}
