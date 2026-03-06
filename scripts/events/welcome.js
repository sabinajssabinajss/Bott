const { getTime } = global.utils;
const axios = require("axios");

if (!global.temp.welcomeEvent)
    global.temp.welcomeEvent = {};

module.exports = {
    config: {
        name: "welcome",
        version: "2.5",
        author: "NTKhang + Modified by BADOL",
        category: "events"
    },

    langs: {
        vi: { session1: "sáng", session2: "trưa", session3: "chiều", session4: "tối" },
        en: { session1: "morning", session2: "noon", session3: "afternoon", session4: "evening" }
    },

    onStart: async ({ threadsData, message, event, api, getLang, usersData }) => {
        if (event.logMessageType == "log:subscribe") {
            const hours = getTime("HH");
            const { threadID } = event;
            const { nickNameBot } = global.GoatBot.config;
            const prefix = global.utils.getPrefix(threadID);
            const dataAddedParticipants = event.logMessageData.addedParticipants;

            if (dataAddedParticipants.some(item => item.userFbId == api.getCurrentUserID())) {
                if (nickNameBot) api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
                
                const botAddedMessage = `╭─━━━━━━━━━━━━━━━━━━━─╮
┃ 𝐀𝐃𝐃𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋 🤖  ┃
┃━━━━━━━━━━━━━━━━━━━┃
┃
┃𝐓𝐇𝐀𝐍𝐊𝐒 𝐅𝐎𝐑 𝐀𝐃𝐃𝐈𝐍𝐆 𝐌𝐄 
┃𝐓𝐎 𝐓𝐇𝐄 𝐆𝐑𝐎𝐔𝐏 🌷🤍
┃
┃━━━━━━━━━━━━━━━━━━━━━┃
┃
┃ 𝐏𝐑𝐄𝐅𝐈𝐗 : ${prefix}
┃
┃━━━━━━━━━━━━━━━━━━━┃
┃ 𝐓𝐘𝐏𝐄 𝐇𝐄𝐋𝐏 𝐒𝐄𝐄   🤖
╰─━━━━━━━━━━━━━━━━━━━─╯`;
                
                return message.send(botAddedMessage);
            }

            if (!global.temp.welcomeEvent[threadID])
                global.temp.welcomeEvent[threadID] = {
                    joinTimeout: null,
                    dataAddedParticipants: []
                };

            global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
            clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

            global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
                const threadData = await threadsData.get(threadID);
                if (threadData.settings.sendWelcomeMessage === false) return;

                const addedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
                const threadName = threadData.threadName || "এই গ্রুপে";
                
                const addedByID = event.author; 
                let addedByName = "Unknown User";

                try {
                    if (addedByID) {
                        const info = await usersData.get(addedByID);
                        if (info && info.name) {
                            addedByName = info.name;
                        } else {
                            const apiInfo = await api.getUserInfo(addedByID);
                            addedByName = apiInfo[addedByID].name;
                        }
                    }
                } catch (e) {
                    console.log("Error getting adder name:", e);
                }

                const userName = [];
                const mentions = [];

                for (const user of addedParticipants) {
                    userName.push(user.fullName);
                    mentions.push({ tag: user.fullName, id: user.userFbId });
                }

                const session = hours <= 10 ? getLang("session1") : hours <= 12 ? getLang("session2") : hours <= 18 ? getLang("session3") : getLang("session4");
                const threadInfo = await api.getThreadInfo(threadID);

                const welcomeMessage = `╭─━━━━━━━━━━━━━━━━━━━─╮
┃     𝐖𝐄𝐋𝐂𝐎𝐌𝐄 🎉    ┃
┃━━━━━━━━━━━━━━━━━━━┃
┃ 💳 𝐍𝐀𝐌𝐄 : ${userName.join(", ")}
┃
┃ 🏡 𝐆𝐑𝐎𝐔𝐏 : ${threadName}
┃
┃ 👥 𝐓𝐎𝐓𝐀𝐋 𝐌𝐄𝐌𝐁𝐄𝐑 : ${threadInfo.participantIDs.length} জন
┃
┃ ⏰ 𝐓𝐈𝐌𝐄 : ${session}
┃
┃🐸  𝐇𝐀𝐕𝐄 𝐀 𝐍𝐈𝐂𝐄 𝐃𝐀𝐘. 
┃━━━━━━━━━━━━━━━━━━━━━┃
┃
┃ ➕ 𝐀𝐃𝐃𝐄𝐃 𝐁𝐘 : ${addedByName}
┃
┃━━━━━━━━━━━━━━━━━━━┃
┃ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐂𝐀𝐏𝐓𝐔𝐑𝐄 𝐁𝐘 𝐇𝐈𝐌𝐔
╰─━━━━━━━━━━━━━━━━━━━─╯`;

                const form = {
                    body: welcomeMessage,
                    mentions: [...mentions, { tag: addedByName, id: addedByID }]
                };

                const imageLinks = [
                    "https://i.ibb.co/9kQXbFny/saimx69x-2ac745.jpg",
                    "https://i.ibb.co/1frcrQLN/saimx69x-4b107e.jpg",
                    "https://i.ibb.co/mFXfW1G2/saimx69x-67a363.jpg",
                    "https://i.ibb.co/7TdBqFy/saimx69x-6c70f7.jpg"
                ];

                const randomIndex = Math.floor(Math.random() * imageLinks.length);
                const selectedImage = imageLinks[randomIndex];

                try {
                    const res = await axios.get(selectedImage, { responseType: "stream" });
                    form.attachment = res.data;
                } catch (err) {
                    console.log("Error fetching image:", err);
                }

                message.send(form);
                delete global.temp.welcomeEvent[threadID];
            }, 2000);
        }
    }
};
