module.exports.config = {
  name: "uid",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Modified by Kawsar",
  description: "শুধু UID রিটার্ন করে",
  commandCategory: "info",
  cooldowns: 0,
 prefix: false
};

module.exports.run = async function ({ event, api, args }) {
  let uid;

  // 1. যদি রিপ্লাই থাকে
  if (event.type === "message_reply") {
    uid = event.messageReply.senderID;
  }

  // 2. না থাকলে মেনশন চেক করো
  else if (event.mentions && Object.keys(event.mentions).length > 0) {
    uid = Object.keys(event.mentions)[0];
  }

  // 3. না থাকলে ফেসবুক লিঙ্ক আছে কিনা দেখো
  else if (args[0] && args[0].includes(".com/")) {
    uid = await api.getUID(args[0]);
  }

  // 4. কিছুই না থাকলে নিজের UID
  else {
    uid = event.senderID;
  }

  return api.sendMessage(`${uid}`, event.threadID, event.messageID);
};
