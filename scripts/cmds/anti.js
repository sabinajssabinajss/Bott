module.exports = {
  config: {
    name: "anti",
    version: "1.3",
    author: "LIKHON AHMED",
    countDown: 0,
    role: 2,
    shortDescription: "Enable or disable antiout",
    longDescription: "",
    category: "box chat",
    guide: "{pn} [on | off]",
    envConfig: {
      deltaNext: 5
    }
  },

  onStart: async function ({ api, message, event, threadsData, args }) {
    try {
      let antiout = await threadsData.get(event.threadID, "settings.antiout");
      
      if (antiout === undefined) {
        await threadsData.set(event.threadID, true, "settings.antiout");
        antiout = true;
      }
      
      if (!args[0]) {
        const status = antiout ? "✅ Enabled" : "❌ Disabled";
        return message.reply(`╭━━━━━━━━━━━━━━╮\n┃  🔰 ANTIOUT STATUS  \n╰━━━━━━━━━━━━━━╯\n\n📊 Current Status: ${status}\n\n💡 Use:\n» /anti on  - to enable\n» /anti off - to disable`);
      }
      
      if (!["on", "off"].includes(args[0])) {
        return message.reply("⚠ Please use 'on' or 'off' as an argument\n\nExample: /anti on");
      }
      
      await threadsData.set(event.threadID, args[0] === "on", "settings.antiout");
      return message.reply(`✅ Antiout has been ${args[0] === "on" ? "enabled" : "disabled"}.`);
      
    } catch (error) {
      console.error("Anti command error:", error);
      return api.sendMessage("❌ Error: " + error.message, event.threadID);
    }
  },

  onEvent: async function ({ api, event, threadsData }) {
    try {
      const antiout = await threadsData.get(event.threadID, "settings.antiout");
      
      if (antiout && event.logMessageData && event.logMessageData.leftParticipantFbId) {
        const userId = event.logMessageData.leftParticipantFbId;
        
        const threadInfo = await api.getThreadInfo(event.threadID);
        const userIndex = threadInfo.participantIDs.indexOf(userId);

        if (userIndex === -1) {
          try {
            await api.addUserToGroup(userId, event.threadID);
            
            const userInfo = await api.getUserInfo(userId);
            const userName = userInfo[userId].name;

            api.sendMessage(
              {
                body: `Ki bara ${userName} leave Xudaw kn 🙄🫶🏼`,
                mentions: [{ tag: userName, id: userId }]
              },
              event.threadID
            );

            console.log(`Active antiout mode, ${userId} has been re-added to the group!`);
          } catch (e) {
            console.log(`> Unable to re-add member ${userId} to the group.`);
          }
        }
      }
    } catch (error) {
      console.error("Anti onEvent error:", error);
    }
  }
};
