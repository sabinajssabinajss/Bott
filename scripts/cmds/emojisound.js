module.exports = {
	config: {
		name: "emojisound",
		version: "1.0",
		author: "LIKHON AHMED",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "tự động phát nhạc khi có emoji",
			en: "auto play music when emoji detected"
		},
		description: {
			vi: "tự động phát nhạc khi có emoji nhất định",
			en: "auto play music when specific emoji detected"
		},
		category: "media",
		guide: {
			vi: "Chỉ cần gửi emoji 🙂 trong group",
			en: "Just send 🙂 emoji in group"
		}
	},

	langs: {
		vi: {
			replyMessage: ""
		},
		en: {
			replyMessage: ""
		}
	},

	onStart: async function ({ api, event, getLang }) {
		
	},

	onChat: async function ({ api, event, getLang }) {
		if (event.body && event.body.includes("🙂")) {
			try {
				const audioUrl = "https://files.catbox.moe/4oks08.mp3";
				const axios = require("axios");
				const fs = require("fs-extra");
				const path = require("path");
				
				const audioPath = path.join(__dirname, "cache", `emoji_sound_${Date.now()}.mp3`);
				const cacheDir = path.join(__dirname, "cache");
				
				if (!fs.existsSync(cacheDir)) {
					fs.mkdirSync(cacheDir, { recursive: true });
				}
				
				const response = await axios({
					method: 'GET',
					url: audioUrl,
					responseType: 'stream'
				});
				
				const writer = fs.createWriteStream(audioPath);
				response.data.pipe(writer);
				
				await new Promise((resolve, reject) => {
					writer.on('finish', resolve);
					writer.on('error', reject);
				});
				
				await api.sendMessage({
					attachment: fs.createReadStream(audioPath)
				}, event.threadID, event.messageID);
				
				setTimeout(() => {
					fs.unlink(audioPath).catch(err => console.error("Error deleting file:", err));
				}, 5000);
				
			} catch (error) {
				console.error("Error in emojisound command:", error);
			}
		}
	}
};
