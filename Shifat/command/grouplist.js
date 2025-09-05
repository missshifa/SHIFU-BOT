const fancy = (text) => {
  return text
    .split('')
    .map(c => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCharCode(0x1d400 + (code - 65));
      else if (code >= 97 && code <= 122) return String.fromCharCode(0x1d41a + (code - 97));
      else return c;
    })
    .join('');
};

module.exports.config = {
  name: 'grouplist',
  version: '1.0.5',
  credits: 'kawsar (fixed by ChatGPT)',
  hasPermssion: 2,
  description: 'List groups with proper message count, leave group, review members, user info',
  commandCategory: 'system',
  usages: 'grouplist',
  cooldowns: 10
};

module.exports.run = async function({ api, event }) {
  const inbox = await api.getThreadList(100, null, ['INBOX']);
  const groups = inbox.filter(thread => thread.isGroup && thread.isSubscribed);

  const groupid = [];
  let msg = `✅ ||⇨ 𝐆𝐫𝐨𝐮𝐩 𝐋𝐢𝐬𝐭\n`;

  function stylishNumber(num) {
    const map = ['𝟎','𝟏','𝟐','𝟑','𝟒','𝟓','𝟔','𝟕','𝟖','𝟗'];
    return num.toString().split('').map(d => map[parseInt(d)]).join('');
  }

  let index = 1;
  for (const group of groups) {
    const groupName = group.name || "Unnamed";

    // messageCount ও memberCount সরাসরি thread থেকে নিচ্ছি
    const messageCount = stylishNumber(group.messageCount || 0);
    const memberCount = stylishNumber(group.participantIDs.length || 0);

    msg += `\n${stylishNumber(index)}. ${groupName}\n`;
    msg += `||⇨ 𝐌𝐞𝐬𝐬𝐚𝐠𝐞:  ${messageCount}\n`;
    msg += `||⇨ 𝐌𝐞𝐦𝐛𝐞𝐫𝐬: ${memberCount}\n`;

    groupid.push(group.threadID);
    index++;
  }

  msg += `\n\n𝐫𝐞𝐩𝐥𝐲: <𝐧𝐮𝐦> <𝐨𝐮𝐭/𝐣𝐨𝐢𝐧/𝐫𝐞𝐯𝐢𝐞𝐰>`;

  api.sendMessage(msg, event.threadID, (err, data) => {
    if (!err) {
      global.client.handleReply.push({
        name: module.exports.config.name,
        author: event.senderID,
        messageID: data.messageID,
        groupid,
        type: 'reply'
      });
    }
  });
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;

  const input = event.body.trim().toLowerCase().split(" ");
  const index = parseInt(input[0]);
  const action = input[1];

  if (isNaN(index) || index < 1 || index > handleReply.groupid.length)
    return api.sendMessage("❌ Invalid group number.", event.threadID, null, event.messageID);

  if (handleReply.type === 'reply') {
    const idgr = handleReply.groupid[index - 1];

    if (action === "out") {
      await api.removeUserFromGroup(api.getCurrentUserID(), idgr);
      return api.sendMessage(`✅ Left group with ID: ${idgr}`, event.threadID, null, event.messageID);
    }

    if (action === "review") {
      // review এর জন্য getThreadInfo() ব্যবহার করবো, কারণ মেম্বার লিস্ট দরকার
      const threadInfo = await api.getThreadInfo(idgr);
      const adminIDs = threadInfo.adminIDs.map(e => e.id);
      const members = threadInfo.userInfo;

      let msg = `=== REVIEW GROUP: ${threadInfo.threadName || "Unnamed"} ===\n`;
      msg += `🧩 TID: ${idgr}\n👥 Total Members: ${members.length}\n\n`;

      msg += `--- ADMINS ---\n`;
      const mentions = [];
      const adminList = members.filter(m => adminIDs.includes(m.id));
      const normalMembers = members.filter(m => !adminIDs.includes(m.id));

      let count = 1;
      const allSorted = [];

      for (const admin of adminList) {
        msg += `${count}. ${admin.name}\n`;
        mentions.push({ tag: admin.name, id: admin.id });
        allSorted.push(admin);
        count++;
      }

      msg += `\n--- MEMBERS ---\n`;
      for (const member of normalMembers) {
        msg += `${count}. ${member.name}\n`;
        allSorted.push(member);
        count++;
      }

      msg += `\nReply with member number to get their info.`;

      api.sendMessage({ body: msg, mentions }, event.threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            author: event.senderID,
            messageID: info.messageID,
            type: "user_info",
            members: allSorted
          });
        }
      });
    }

    if (action === "join") {
      try {
        await api.addUserToGroup(event.senderID, idgr);
        return api.sendMessage(`✅ You have been added to the group successfully!`, event.threadID, null, event.messageID);
      } catch (err) {
        return api.sendMessage(`❌ Couldn't add you to the group. Maybe approval is needed or permission missing.`, event.threadID, null, event.messageID);
      }
    }
  }

  if (handleReply.type === "user_info") {
    const members = handleReply.members;
    const i = parseInt(event.body.trim());
    const user = members[i - 1];
    if (!user) return api.sendMessage("❌ Invalid member number.", event.threadID, null, event.messageID);

    try {
      const res = await api.getUserInfo(user.id);
      const info = res[user.id];

      const name = info.name;
      const link = `https://facebook.com/${user.id}`;
      const gender = info.gender === 2 ? "Male" : info.gender === 1 ? "Female" : "Unknown";
      const friend = info.friendCount || "N/A";

      const msg = `=== USER INFO ===\n\n` +
        `Name: ${name}\n` +
        `UID: ${user.id}\n` +
        `Gender: ${gender}\n` +
        `Profile: ${link}\n` +
        `Friend Count: ${friend}`;

      api.sendMessage(msg, event.threadID, null, event.messageID);
    } catch (err) {
      api.sendMessage("❌ Failed to fetch user info.", event.threadID, null, event.messageID);
    }
  }
};
