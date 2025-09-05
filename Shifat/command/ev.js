const fs = require("fs");

module.exports = {
  config: {
    name: "ev",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "kawsar",
    description: "JS code execute করো (admin only)",
    commandCategory: "system",
    usages: "[JS code]",
    cooldowns: 5
  },

  run: async function({ api, event, args }) {
    const content = args.join(" ");
    if (!content) return api.sendMessage("⚠️ কোড দে!", event.threadID, event.messageID);

    try {
      let result = await eval(content);
      if (typeof result !== "string") result = require("util").inspect(result, { depth: 0 });
      api.sendMessage("✅ Result:\n" + result, event.threadID, event.messageID);
    } catch (err) {
      api.sendMessage("❌ Error:\n" + err, event.threadID, event.messageID);
    }
  }
};
