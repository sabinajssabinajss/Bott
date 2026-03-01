const { removeHomeDir, log } = global.utils;

module.exports = {
  config: {
    name: "eval",
    version: "1.6",
    author: "LIKHON AHMED",
    countDown: 5,
    role: 2,
    shortDescription: {
      vi: "Test code nhanh",
      en: "Test code quickly"
    },
    longDescription: {
      vi: "Test code nhanh",
      en: "Test code quickly"
    },
    category: "owner",
    guide: {
      vi: "{pn} <đoạn code cần test>",
      en: "{pn} <code to test>"
    }
  },

  langs: {
    vi: {
      error: "❌ Đã có lỗi xảy ra:"
    },
    en: {
      error: "❌ An error occurred:"
    }
  },

  onStart: async function ({ api, args, message, event, threadsData, usersData, dashBoardData, globalData, threadModel, userModel, dashBoardModel, globalModel, role, commandName, getLang }) {
    
    function output(msg) {
      if (typeof msg === "number" || typeof msg === "boolean" || typeof msg === "function") {
        msg = msg.toString();
      } else if (msg instanceof Map) {
        let text = `Map(${msg.size}) `;
        text += JSON.stringify(mapToObj(msg), null, 2);
        msg = text;
      } else if (msg instanceof Set) {
        let text = `Set(${msg.size}) `;
        text += JSON.stringify([...msg], null, 2);
        msg = text;
      } else if (msg instanceof RegExp) {
        msg = msg.toString();
      } else if (typeof msg === "object" && msg !== null) {
        msg = JSON.stringify(msg, null, 2);
      } else if (typeof msg === "undefined") {
        msg = "undefined";
      } else if (msg === null) {
        msg = "null";
      }
      
      message.reply(msg).catch(err => console.error("Output error:", err));
    }
    
    function out(msg) {
      output(msg);
    }
    
    function mapToObj(map) {
      const obj = {};
      map.forEach((v, k) => {
        obj[k] = v;
      });
      return obj;
    }

    const code = args.join(" ");
    
    if (!code) {
      return message.reply("⚠ Please provide code to execute.");
    }

    try {
      const result = await eval(`(async () => { ${code} })()`);
      
      if (result !== undefined) {
        output(result);
      }
      
    } catch (err) {
      log.err("eval command", err);
      
      let errorMessage = getLang("error") + "\n";
      
      if (err.stack) {
        errorMessage += removeHomeDir(err.stack);
      } else {
        errorMessage += removeHomeDir(JSON.stringify(err, Object.getOwnPropertyNames(err), 2) || "");
      }
      
      message.send(errorMessage).catch(e => console.error("Error sending error message:", e));
    }
  }
};
