module.exports = {
	config: {
		name: "pinterest",
		version: "1.0.0",
		author: "LIKHON AHMED",
		countDown: 10,
		role: 0,
		shortDescription: {
			vi: "tìm kiếm hình ảnh",
			en: "image search"
		},
		description: {
			vi: "tìm kiếm hình ảnh trên pinterest",
			en: "search images on pinterest"
		},
		category: "with prefix",
		guide: {
			vi: "pinterest <từ khóa> - <số lượng>",
			en: "pinterest <keyword> - <amount>"
		}
	},

	langs: {
		vi: {
			missing: "⚠️ Vui lòng nhập theo định dạng: pinterest <từ khóa> - <số lượng>",
			noResults: "❌ Không tìm thấy kết quả nào cho: %1",
			success: "✅ %1 hình ảnh cho: %2",
			searching: "🔍 Đang tìm %1 hình ảnh cho: %2...",
			failed: "❌ Không thể tải ảnh. Vui lòng thử lại.",
			error: "❌ Đã xảy ra lỗi. Vui lòng thử lại sau."
		},
		en: {
			missing: "⚠️ Please enter in format: pinterest <keyword> - <amount>",
			noResults: "❌ No results found for: %1",
			success: "✅ %1 images for: %2",
			searching: "🔍 Searching %1 images for: %2...",
			failed: "❌ Failed to download images. Please try again.",
			error: "❌ An error occurred. Please try again later."
		}
	},

	onStart: async function ({ message, args, getLang }) {
		const axios = require("axios");
		const fs = require("fs-extra");
		
		try {
			const keySearch = args.join(" ");
			
			if (!keySearch.includes("-")) {
				return message.reply(getLang("missing"));
			}
			
			const keySearchs = keySearch.slice(0, keySearch.indexOf('-')).trim();
			let numberSearch = parseInt(keySearch.split("-").pop().trim()) || 6;
			
			if (numberSearch > 20) numberSearch = 20;
			if (numberSearch < 1) numberSearch = 1;
			
			const { pintarest } = require('nayan-api-servers');
			
			message.reply(getLang("searching", numberSearch, keySearchs));
			
			const res = await pintarest(`${encodeURIComponent(keySearchs)}`);
			
			if (!res || !res.data || res.data.length === 0) {
				return message.reply(getLang("noResults", keySearchs));
			}
			
			const data = res.data;
			var imgData = [];
			var cachePaths = [];
			
			for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
				try {
					let path = __dirname + `/cache/pinterest_${i}_${Date.now()}.jpg`;
					let getDown = (await axios.get(`${data[i]}`, { 
						responseType: 'arraybuffer',
						timeout: 10000 
					})).data;
					
					fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
					imgData.push(fs.createReadStream(path));
					cachePaths.push(path);
				} catch (err) {
					console.error(err);
				}
			}
			
			if (imgData.length === 0) {
				return message.reply(getLang("failed"));
			}
			
			await message.reply({
				attachment: imgData,
				body: getLang("success", imgData.length, keySearchs)
			});
			
			for (const path of cachePaths) {
				try {
					fs.unlinkSync(path);
				} catch (err) {
					console.error(err);
				}
			}
			
		} catch (error) {
			console.error(error);
			message.reply(getLang("error"));
		}
	}
};
