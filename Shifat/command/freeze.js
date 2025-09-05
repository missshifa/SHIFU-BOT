const fs = require("fs");
const path = require("path");
const freezePath = path.join(__dirname, "..", "..", "freeze.lock");

module.exports.config = {
  name: "freeze",
  version: "1.0.2",
  hasPermssion: 2,
  credits: "Kawsar",
  description: "Freeze the bot",
  commandCategory: "System",
  usages: "freeze",
  cooldowns: 3,
  prefix: false
};

module.exports.run = async function ({ api, event }) {
  const { messageID } = event;

  if (fs.existsSync(freezePath)) {
    // আগেই freeze করা থাকলে কিছু না করবে
    return;
  }

  fs.writeFileSync(freezePath, "frozen");
  return api.setMessageReaction("✅", messageID, () => {}, true);
};
