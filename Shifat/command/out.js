module.exports.config = {
  name: "out",
  version: "1.0.1",
  hasPermssion: 2,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 + Kawsar",
  description: "Leave group now or schedule leave with subcommands",
  commandCategory: "Admin",
  usages: "out [all] [mm:ss]",
  cooldowns: 5,
};

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports.run = async function({ api, event, args }) {
  const { threadID } = event;
  const nowGroup = threadID;
  const isAll = args.includes("all");

  // Time format: mm:ss
  let timeArg = args.find(arg => /^\d{1,2}:\d{2}$/.test(arg));
  let delayMs = 0;
  if (timeArg) {
    let [mm, ss] = timeArg.split(":").map(Number);
    delayMs = (mm * 60 + ss) * 1000;
  }

  // Remove bot from group
  async function leaveGroup(tid) {
    try {
      await api.removeUserFromGroup(api.getCurrentUserID(), tid);
      return true;
    } catch {
      return false;
    }
  }

  // 1. out => leave current group now
  if (!isAll && args.length === 0) {
    await leaveGroup(nowGroup);
    return;
  }

  // 2. out all => leave all other groups immediately
  if (isAll && !timeArg) {
    const list = await api.getThreadList(100, null, ["INBOX"]);
    const groups = list.filter(g => g.isGroup && g.threadID !== nowGroup);
    let success = true;
    for (const group of groups) {
      const res = await leaveGroup(group.threadID);
      if (!res) success = false;
    }

    if (success) {
      await api.setMessageReaction("✅", event.messageID, () => {}, true);
    } else {
      await api.sendMessage("❌ ||⇨ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐥𝐞𝐚𝐯𝐞 𝐬𝐨𝐦𝐞 𝐠𝐫𝐨𝐮𝐩𝐬.", threadID);
    }
    return;
  }

  // 3. out mm:ss => scheduled leave current group
  if (!isAll && timeArg) {
    setTimeout(async () => {
      await leaveGroup(nowGroup);
    }, delayMs);
    return;
  }

  // 4. out all mm:ss => scheduled leave all groups
  if (isAll && timeArg) {
    const list = await api.getThreadList(100, null, ["INBOX"]);
    const groups = list.filter(g => g.isGroup && g.threadID !== nowGroup);
    setTimeout(async () => {
      let success = true;
      for (const group of groups) {
        const res = await leaveGroup(group.threadID);
        if (!res) success = false;
      }

      if (success) {
        await api.setMessageReaction("✅", event.messageID, () => {}, true);
      } else {
        await api.sendMessage("❌ ||⇨ 𝐒𝐜𝐡𝐞𝐝𝐮𝐥𝐞𝐝 𝐥𝐞𝐚𝐯𝐞 𝐟𝐚𝐢𝐥𝐞𝐝 𝐟𝐨𝐫 𝐬𝐨𝐦𝐞 𝐠𝐫𝐨𝐮𝐩𝐬.", threadID);
      }
    }, delayMs);
    return;
  }

  // 5. Invalid usage
  return api.sendMessage("⚠️ ||⇨ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐮𝐬𝐚𝐠𝐞!", threadID);
};
