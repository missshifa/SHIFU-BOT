module.exports.config = {
  name: "antiout",
  version: "1.0.0",
  credits: "Kawsar",
  description: "কেউ বের হলে আবার অ্যাড করে + টগল করা যায়",
  eventType: ["log:unsubscribe"],
  commandCategory: "group",
  usages: "",
  cooldowns: 5
};

module.exports.run = async ({ api, event, Threads }) => {
  const threadID = event.threadID;
  let threadData = await Threads.getData(threadID);
  let data = threadData.data || {};

  // ডিফল্টে antiout চালু
  if (typeof data.antiout == "undefined") data.antiout = true;

  // মান toggle করো
  data.antiout = !data.antiout;

  // ডেটা সেভ করো
  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);

  // রেসপন্স পাঠাও
  return api.sendMessage(
    data.antiout
      ? "✅ আয়না ঘরের দায়িত্ব পেয়ে গেলাম \n\n\n দায়িত্বরত:   sohana"
      : "ভাই কেউ চলে গেলে আমার কিছু করার নাই😑😑\n\n\n ইতি,\n sohana",
    threadID
  );
};

module.exports.handleEvent = async ({ event, api, Threads, Users }) => {
  // কেউ গ্রুপ ছাড়লে
  if (event.logMessageData?.leftParticipantFbId == api.getCurrentUserID()) return;

  let threadData = await Threads.getData(event.threadID);
  let data = threadData.data || {};

  // ডিফল্টে antiout চালু
  if (typeof data.antiout == "undefined") data.antiout = true;
  if (!data.antiout) return;

  const userID = event.logMessageData.leftParticipantFbId;
  const name = global.data.userName.get(userID) || await Users.getNameUser(userID);

  // নিজের ইচ্ছায় বের হলে আবার অ্যাড করো
  if (event.author == userID) {
    api.addUserToGroup(userID, event.threadID, (err) => {
      if (err) {
        // কেউ আবার অ্যাড দিতে না পারলে কোনো ম্যাসেজ দিবে না
        return;
      } else {
        return api.sendMessage(`🤭 ${name}, আমাদের আয়না ঘর থেকে পালানো এত সহজ না,,,,🤞\n\n\nইতি,\nসোহানা।`, event.threadID);
      }
    });
  }
};
