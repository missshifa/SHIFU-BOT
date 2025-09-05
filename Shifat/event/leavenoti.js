module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "3.0.0",
  credits: " ⚠️ ||⇨ Kawsar Ahmed",
  description: "Send stylish alert when someone leaves the group"
};

module.exports.run = async function ({ api, event, Users }) {
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dhaka").format("HH:mm:ss");
  const { threadID } = event;

  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId)
            || await Users.getNameUser(event.logMessageData.leftParticipantFbId);

  // 🌀 All styles in one array
  const styles = [
    `⚠️ ||⇨ 𝐋𝐄𝐀𝐕𝐄 𝐀𝐋𝐄𝐑𝐓 ⇦|| ⚠️\n\n➤ 𝐍𝐚𝐦𝐞: ${name}\n➤ 𝐓𝐢𝐦𝐞:  ${time}`,

    `╔══ ❖ 𝐋𝐄𝐀𝐕𝐄 𝐀𝐋𝐄𝐑𝐓 ❖ ══╗\n║ 🧍‍♂️ 𝐍𝐚𝐦𝐞: ${name}\n║ ⏰ 𝐓𝐢𝐦𝐞: ${time}\n╚═════════════════════╝`,

    `↯↯↯ 𝐋𝐄𝐀𝐕𝐄 𝐀𝐋𝐄𝐑𝐓 ↯↯↯\n\n➢ 𝐍𝐚𝐦𝐞: ${name}\n➢ 𝐓𝐢𝐦𝐞: ${time}`,

    `❖ 𝐋𝐞𝐚𝐯𝐞 𝐃𝐞𝐭𝐞𝐜𝐭𝐞𝐝 ❖\n\n🔹 𝐍𝐚𝐦𝐞: ${name}\n🔹 𝐓𝐢𝐦𝐞: ${time}`
  ];

  // Pick random one
  const msg = styles[Math.floor(Math.random() * styles.length)];

  return api.sendMessage(msg, threadID);
};
