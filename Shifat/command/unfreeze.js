const fs = require("fs");
const path = require("path");
const freezePath = path.join(__dirname, "..", "..", "freeze.lock");

module.exports.config = {
  name: "unfreeze",
  version: "1.0.2",
  hasPermssion: 2,
  credits: "Kawsar",
  description: "Unfreeze the bot",
  commandCategory: "System",
  usages: "unfreeze",
  cooldowns: 3,
  prefix: false
};

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;

  if (!fs.existsSync(freezePath)) {
    // আগেই unfreeze থাকলে কিছু না করবে
    return;
  }

  fs.unlinkSync(freezePath);
  return api.sendMessage("i am back guys 😃", threadID);
};
