const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");

module.exports = (
	api,
	threadModel,
	userModel,
	dashBoardModel,
	globalModel,
	usersData,
	threadsData,
	dashBoardData,
	globalData
) => {
	const handlerEvents = require(
		process.env.NODE_ENV == "development"
			? "./handlerEvents.dev.js"
			: "./handlerEvents.js"
	)(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

	// যে কমান্ডগুলো প্রিফিক্স ছাড়া কাজ করবে না
	const noNoPrefixCommands = ['prefix', 'bot']; // এখানে আপনার কমান্ডের নাম দিন

	// সব কমান্ডের নাম লোড করার ফাংশন
	const getAllCommandNames = () => {
		const commandNames = [];
		for (const cmd of global.GoatBot.commands.values()) {
			if (cmd.config && cmd.config.name) {
				commandNames.push(cmd.config.name.toLowerCase());
				// যদি aliases থাকে, সেগুলোও যোগ করুন
				if (cmd.config.aliases && Array.isArray(cmd.config.aliases)) {
					commandNames.push(...cmd.config.aliases.map(a => a.toLowerCase()));
				}
			}
		}
		return commandNames;
	};

	return async function (event) {
		if (
			global.GoatBot.config.antiInbox == true &&
			(event.senderID == event.threadID ||
				event.userID == event.senderID ||
				event.isGroup == false) &&
			(event.senderID || event.userID || event.isGroup == false)
		)
			return;

		const message = createFuncMessage(api, event);

		// --- [ START: IMPROVED NO PREFIX SYSTEM ] ---
		// No Prefix মোড চেক এবং শুধুমাত্র নির্দিষ্ট কমান্ডের জন্য প্রিফিক্স যোগ করা
		if (global.GoatBot.config.noPrefixMode && event.body && !event.body.startsWith(global.GoatBot.config.prefix)) {
			const messageBody = event.body.trim().toLowerCase();
			const commandNames = getAllCommandNames();
			
			// মেসেজের প্রথম শব্দটি বের করা
			const firstWord = messageBody.split(/\s+/)[0] || '';
			
			// চেক করা যে প্রথম শব্দটি কোনো কমান্ডের নাম কিনা
			if (commandNames.includes(firstWord)) {
				// চেক করা যে এই কমান্ডটি কি noNoPrefixCommands লিস্টে আছে কিনা
				if (noNoPrefixCommands.includes(firstWord)) {
					// শুধুমাত্র ম্যাচ করা কমান্ডের জন্য প্রিফিক্স যোগ করা
					event.body = global.GoatBot.config.prefix + event.body;
					console.log(`No Prefix: Command "${firstWord}" is in no-prefix block list, prefix added`);
				} else {
					console.log(`No Prefix: Command "${firstWord}" allowed without prefix`);
					// প্রিফিক্স যোগ করা হবে না, কারণ এটি allowed
				}
			}
			// এলোমেলো টেক্সট, ইমোজি, লিংক ইগনোর করা হবে
		}
		// --- [ END: IMPROVED NO PREFIX SYSTEM ] ---

		await handlerCheckDB(usersData, threadsData, event);

		const handlerChat = await handlerEvents(event, message);
		if (!handlerChat) return;

		const {
			onAnyEvent,
			onFirstChat,
			onStart,
			onChat,
			onReply,
			onEvent,
			handlerEvent,
			onReaction,
			typ,
			presence,
			read_receipt,
		} = handlerChat;

		onAnyEvent();

		switch (event.type) {
			case "message":
			case "message_reply":
			case "message_unsend":
				onFirstChat();
				onChat();
				onStart();
				onReply();
				break;

			case "event":
				handlerEvent();
				onEvent();
				break;

			case "message_reaction":
				// 🟡 Custom unsend logic for bot reaction
				if (["🤦", "😠", "😡", "🤬"].includes(event.reaction)) {
					if (event.senderID === api.getCurrentUserID()) {
						const adminBotList = global.GoatBot.config.adminBot || []; 
						if (adminBotList.includes(event.userID)) {
							api.unsendMessage(event.messageID);
						}
					}
				}

				onReaction();
				break;

			case "typ":
				typ();
				break;

			case "presence":
				presence();
				break;

			case "read_receipt":
				read_receipt();
				break;

			default:
				break;
		}
	};
};
