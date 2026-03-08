module.exports = {
	config: {
		name: "raw",
		version: "1.0",
		author: "LIKHON AHMED",
		countDown: 5,
		role: 0,
		shortDescription: {
			en: "Get raw file link from GitHub"
		},
		longDescription: {
			en: "Shows GitHub raw link of any command file"
		},
		category: "utility",
		guide: {
			en: "raw [command name]"
		}
	},

	langs: {
		en: {
			noFileName: "❌ Please provide a command name",
			fileNotFound: "❌ No command found with name '%1'"
		}
	},

	onStart: async function ({ message, args, event, getLang }) {
		if (args.length === 0) {
			return message.reply(getLang("noFileName"));
		}

		const commandName = args[0].toLowerCase();
		
		const GITHUB_USERNAME = "likhontheoldstyle";
		const GITHUB_REPO = "LIKHON-MESENGER-BOT";
		const GITHUB_BRANCH = "main";
		
		const possiblePaths = [
			`scripts/cmds/${commandName}.js`,
			`cmds/${commandName}.js`,
			`commands/${commandName}.js`,
			`src/commands/${commandName}.js`,
			`${commandName}.js`
		];

		const axios = require('axios');

		try {
			let fileFound = false;
			let rawUrl = "";

			for (const path of possiblePaths) {
				const url = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;
				
				try {
					const response = await axios.head(url);
					if (response.status === 200) {
						rawUrl = url;
						fileFound = true;
						break;
					}
				} catch (error) {
					continue;
				}
			}

			if (fileFound && rawUrl) {
				return message.reply(rawUrl);
			} else {
				return message.reply(getLang("fileNotFound", commandName));
			}

		} catch (error) {
			console.error("Error in raw command:", error);
			return message.reply(`❌ Error: ${error.message}`);
		}
	}
};
