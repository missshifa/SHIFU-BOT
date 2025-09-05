module.exports.config = {
  name: "adduser",
  version: "1.0.1",
  hasPermssion: 2,
  credits: "Kawsar",
  description: "UID বা প্রোফাইল লিংক দিয়ে গ্রুপে ইউজার অ্যাড করে",
  commandCategory: "group",
  usages: "[uid/link]",
  cooldowns: 5,
prefix: false
};

module.exports.run = async function ({ api, event, args }) {
  if (!args[0]) return api.sendMessage("❌ অনুগ্রহ করে একটি UID অথবা Facebook প্রোফাইল লিংক দিন।", event.threadID, event.messageID);

  let uid = args[0];

  // যদি লিংক হয়, তাহলে getUID দিয়ে রিসল্ভ করো
  if (uid.includes(".com/")) {
    try {
      uid = await api.getUID(uid);
    } catch (e) {
      return api.sendMessage("❌ UID বের করতে ব্যর্থ হলাম। লিংকটি সঠিক কিনা যাচাই করুন।", event.threadID, event.messageID);
    }
  }

  // এখন addUser করো
  try {
    await api.addUserToGroup(uid, event.threadID);
    return api.sendMessage(`done✅`, event.threadID, event.messageID);
  } catch (e) {
    return api.sendMessage(`❌ অ্যাড করতে ব্যর্থ: ${e.message || e}`, event.threadID, event.messageID);
  }
};
