const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "file2",
  version: "1.0.3",
  hasPermssion: 2,
  credits: "Kawsar",
  description: "Create command file via code, reply or raw link (pastebin/github)",
  commandCategory: "System",
  usages: "file filename.js\n(file filename.js <code or raw link>)\nReply to code/link message with: file filename.js",
  cooldowns: 5,
};

function isCode(text) {
  if (!text) return false;
  const t = text.toLowerCase();
  return /module\.exports|function|=>/.test(t);
}

function isRawLink(text) {
  if (!text) return false;
  return /(pastebin\.com\/raw\/|raw\.githubusercontent\.com\/)/.test(text);
}

async function fetchCodeFromLink(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    return null;
  }
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, messageReply } = event;

  if (!args[0]) {
    return api.sendMessage("❌ ফাইলের নাম দিতে হবে, যেমন: file test.js", threadID, messageID);
  }

  const filename = args[0];
  if (!filename.endsWith(".js")) {
    return api.sendMessage("❌ ফাইলের নাম অবশ্যই .js দিয়ে শেষ হতে হবে!", threadID, messageID);
  }

  const filePath = path.join(__dirname, filename);

  // ১) reply থেকে কাজ নেয়ার চেষ্টা
  if (messageReply && args.length === 1) {
    const repliedMsg = messageReply.body || "";

    // যদি reply তে raw link থাকে
    if (isRawLink(repliedMsg)) {
      const code = await fetchCodeFromLink(repliedMsg);
      if (!code) {
        return api.sendMessage("❌ লিংক থেকে কোড আনা যায়নি। আবার চেস্টা করো।", threadID, messageID);
      }
      if (!isCode(code)) {
        return api.sendMessage("⚠️ লিংক থেকে পাওয়া কোড সঠিক মনে হচ্ছে না।", threadID, messageID);
      }
      try {
        fs.writeFileSync(filePath, code, "utf-8");
      } catch (e) {
        return api.sendMessage(`❌ ফাইল লেখা গেল না:\n${e.message}`, threadID, messageID);
      }
      return api.sendMessage(`✅ "${filename}" সফলভাবে তৈরি হয়েছে।`, threadID, messageID);
    }

    // reply তে সরাসরি কোড থাকলে
    if (isCode(repliedMsg)) {
      try {
        fs.writeFileSync(filePath, repliedMsg, "utf-8");
      } catch (e) {
        return api.sendMessage(`❌ ফাইল লেখা গেল না:\n${e.message}`, threadID, messageID);
      }
      return api.sendMessage(`✅ "${filename}" সফলভাবে তৈরি হয়েছে।`, threadID, messageID);
    }

    // reply তে কোড বা লিংক না থাকলে error
    return api.sendMessage(
      "⚠️ যেটা reply দিচ্ছো সেটি কোড বা raw link মনে হচ্ছে না। সঠিক কোড বা raw link সহ reply করো।",
      threadID,
      messageID
    );
  }

  // ২) inline কোড বা লিংক থেকে কোড নেয়ার চেষ্টা
  const inputAfterFilename = args.slice(1).join(" ").trim();

  if (inputAfterFilename) {
    // যদি raw link হয়
    if (isRawLink(inputAfterFilename)) {
      const code = await fetchCodeFromLink(inputAfterFilename);
      if (!code) {
        return api.sendMessage("❌ লিংক থেকে কোড আনা যায়নি। আবার চেস্টা করো।", threadID, messageID);
      }
      if (!isCode(code)) {
        return api.sendMessage("⚠️ লিংক থেকে পাওয়া কোড সঠিক মনে হচ্ছে না।", threadID, messageID);
      }
      try {
        fs.writeFileSync(filePath, code, "utf-8");
      } catch (e) {
        return api.sendMessage(`❌ ফাইল লেখা গেল না:\n${e.message}`, threadID, messageID);
      }
      return api.sendMessage(`✅ "${filename}" সফলভাবে তৈরি হয়েছে।`, threadID, messageID);
    }

    // inline কোড হলে
    if (isCode(inputAfterFilename)) {
      try {
        fs.writeFileSync(filePath, inputAfterFilename, "utf-8");
      } catch (e) {
        return api.sendMessage(`❌ ফাইল লেখা গেল না:\n${e.message}`, threadID, messageID);
      }
      return api.sendMessage(`✅ "${filename}" সফলভাবে তৈরি হয়েছে।`, threadID, messageID);
    }

    // না হলে error
    return api.sendMessage(
      "⚠️ কোড বা raw link মনে হচ্ছে না, সঠিক কোড বা raw link দিন অথবা reply দিয়ে কোড দিন।",
      threadID,
      messageID
    );
  }

  // ৩) কোন কোড বা লিংক inline নাই, তাই কোড চাওয়া হচ্ছে
  return api.sendMessage(
    `⚠️ কোড দিন, এই মেসেজে reply দিয়ে কোড বা raw link দিন অথবা সরাসরি কমান্ডের সাথে কোড/লিংক লিখুন।\n\nUsage:\nfile ${filename}\n<code or raw link>`,
    threadID,
    (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        author: senderID,
        messageID: info.messageID,
        filename: filePath,
      });
    }
  );
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (event.senderID != handleReply.author) return;

  const replyBody = event.body.trim();

  // reply তে raw link হলে
  if (isRawLink(replyBody)) {
    const code = await fetchCodeFromLink(replyBody);
    if (!code) {
      return api.sendMessage("❌ লিংক থেকে কোড আনা যায়নি। আবার চেস্টা করো।", event.threadID, event.messageID);
    }
    if (!isCode(code)) {
      return api.sendMessage("⚠️ লিংক থেকে পাওয়া কোড সঠিক মনে হচ্ছে না।", event.threadID, event.messageID);
    }
    try {
      fs.writeFileSync(handleReply.filename, code, "utf-8");
    } catch (e) {
      return api.sendMessage(`❌ ফাইল লেখা গেল না:\n${e.message}`, event.threadID, event.messageID);
    }
    return api.sendMessage(
      `✅ "${require("path").basename(handleReply.filename)}" সফলভাবে তৈরি হয়েছে।`,
      event.threadID,
      event.messageID
    );
  }

  // reply তে সরাসরি কোড হলে
  if (isCode(replyBody)) {
    try {
      fs.writeFileSync(handleReply.filename, replyBody, "utf-8");
    } catch (e) {
      return api.sendMessage(`❌ ফাইল লেখা গেল না:\n${e.message}`, event.threadID, event.messageID);
    }
    return api.sendMessage(
      `✅ "${require("path").basename(handleReply.filename)}" সফলভাবে তৈরি হয়েছে।`,
      event.threadID,
      event.messageID
    );
  }

  // কোড বা লিংক না হলে error
  return api.sendMessage(
    "⚠️ কোড মনে হচ্ছে না, দয়া করে সঠিক কোড রিপ্লাই করুন বা লিংক দিন।",
    event.threadID,
    event.messageID
  );
};
