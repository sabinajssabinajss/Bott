const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["photo", 'png', "animated_image", "video", "audio"];

module.exports = {
  config: {
    name: "called",
    version: "1.8",
    author: "LIKHON AHMED",
    countDown: 5,
    role: 0,
    description: {
      en: "send report, feedback, bug,... to admin group"
    },
    category: "contacts admin",
    guide: {
      en: "{pn} <message>"
    }
  },

  langs: {
    en: {
      missingMessage: "⚠ Please enter the message you want to send to admin",
      sendByGroup: "\n- Sent from group: %1\n- Thread ID: %2",
      sendByUser: "\n- Sent from user",
      content: "\n\n📝 Content:\n─────────────────\n%1\n─────────────────",
      success: "✅ Your message has been sent to admin group successfully!",
      failed: "❌ An error occurred while sending your message to admin group\nCheck console for more details",
      reply: "📍 Reply from admin:\n─────────────────\n%1\n─────────────────\nReply this message to continue sending message to admin",
      replySuccess: "✅ Your reply has been sent to admin group successfully!",
      feedback: "📝 Feedback from user %1:\n- User ID: %2%3\n\n📝 Content:\n─────────────────\n%4\n─────────────────",
      replyUserSuccess: "✅ Your reply has been sent to user successfully!",
      noAdmin: "⚠ Admin group is not configured yet",
      replyHere: "💬 Reply to this message to send your response to admin"
    }
  },

  onStart: async function ({ args, message, event, usersData, threadsData, api, commandName, getLang }) {
    try {
      const ADMIN_GROUP_ID = "8174291506001802";
      
      if (!args[0]) {
        return message.reply(getLang("missingMessage"));
      }
      
      const { senderID, threadID, isGroup } = event;
      
      const senderName = await usersData.getName(senderID);
      
      let groupInfo = "";
      if (isGroup) {
        const threadData = await threadsData.get(threadID);
        groupInfo = getLang("sendByGroup", threadData.threadName || "Unnamed group", threadID);
      } else {
        groupInfo = getLang("sendByUser");
      }

      const attachments = await getStreamsFromAttachment(
        [...event.attachments, ...(event.messageReply?.attachments || [])]
          .filter(item => mediaTypes.includes(item.type))
      );

      const msg = `📢 **CALL ADMIN**\n\n` +
        `👤 User: ${senderName}\n` +
        `🆔 User ID: ${senderID}` +
        groupInfo +
        getLang("content", args.join(" "));

      const formMessage = {
        body: msg,
        attachment: attachments
      };

      try {
        const messageSend = await api.sendMessage(formMessage, ADMIN_GROUP_ID);
        
        global.GoatBot.onReply.set(messageSend.messageID, {
          commandName,
          messageID: messageSend.messageID,
          threadID: threadID,
          messageIDSender: event.messageID,
          type: "userCallAdmin",
          senderID: senderID,
          senderName: senderName,
          isGroup: isGroup,
          groupInfo: groupInfo
        });

        await message.reply(getLang("success"));
        
      } catch (err) {
        console.error("CallAd Error:", err);
        await message.reply(getLang("failed"));
      }
      
    } catch (error) {
      console.error("CallAd onStart Error:", error);
      return message.reply("❌ Error: " + error.message);
    }
  },

  onReply: async ({ args, event, api, message, Reply, usersData, commandName, getLang }) => {
    try {
      const ADMIN_GROUP_ID = "8174291506001802";
      const { type, threadID, messageIDSender, senderID, senderName, isGroup, groupInfo } = Reply;
      const replyMessage = args.join(" ");

      if (!replyMessage) {
        return message.reply(getLang("missingMessage"));
      }

      const senderName2 = await usersData.getName(event.senderID);
      const attachments = await getStreamsFromAttachment(
        event.attachments.filter(item => mediaTypes.includes(item.type))
      );

      switch (type) {
        case "userCallAdmin": {
          const msg = `💬 **REPLY FROM ADMIN**\n\n` +
            `👤 Admin: ${senderName2}\n` +
            `🆔 Admin ID: ${event.senderID}\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `📝 Message:\n${replyMessage}\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            getLang("replyHere");

          const messageSend = await api.sendMessage({
            body: msg,
            attachment: attachments
          }, ADMIN_GROUP_ID);

          global.GoatBot.onReply.set(messageSend.messageID, {
            commandName,
            messageID: messageSend.messageID,
            threadID: threadID,
            messageIDSender: event.messageID,
            type: "adminReply",
            senderID: senderID,
            senderName: senderName,
            isGroup: isGroup,
            groupInfo: groupInfo,
            originalMessage: replyMessage
          });

          await message.reply(getLang("replyUserSuccess"));
          break;
        }

        case "adminReply": {
          let sendByGroup = "";
          if (isGroup) {
            sendByGroup = groupInfo || "";
          }

          const msg = getLang("feedback", senderName, senderID, sendByGroup, replyMessage);

          const messageSend = await api.sendMessage({
            body: msg,
            attachment: attachments,
            mentions: [{
              id: senderID,
              tag: senderName
            }]
          }, threadID, messageIDSender);

          global.GoatBot.onReply.set(messageSend.messageID, {
            commandName,
            messageID: messageSend.messageID,
            threadID: ADMIN_GROUP_ID,
            messageIDSender: event.messageID,
            type: "userCallAdmin",
            senderID: senderID,
            senderName: senderName,
            isGroup: isGroup,
            groupInfo: groupInfo
          });

          await message.reply(getLang("replySuccess"));
          break;
        }

        default:
          break;
      }
      
    } catch (error) {
      console.error("CallAd onReply Error:", error);
      return message.reply("❌ Error: " + error.message);
    }
  }
};
