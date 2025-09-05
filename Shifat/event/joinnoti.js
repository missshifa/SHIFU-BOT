module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "1.1.0",
  credits: "||⇨ Kawsar Ahmed",
  description: "Send stylish alert with mentions when someone joins the group"
};

module.exports.run = async function ({ api, event, Users }) {
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dhaka").format("HH:mm:ss");
  const { threadID } = event;

  // বট নিজেই যোগ দিলে মেসেজ যাবে না
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) return;

  const addedUsers = event.logMessageData.addedParticipants;
  if (!addedUsers || addedUsers.length === 0) return;

  // ম্যানশন তৈরির জন্য অ্যারে
  let mentions = [];
  // নামগুলোর জন্য টেক্সট তৈরির জন্য
  let nameTexts = [];

  for (const user of addedUsers) {
    const name = global.data.userName.get(user.userFbId) || await Users.getNameUser(user.userFbId);
    nameTexts.push(name);
    mentions.push({
      tag: name,
      id: user.userFbId
    });
  }

  // একসাথে নামগুলো কে কৌমা দিয়ে যুক্ত করলাম
  const namesStr = nameTexts.join(", ");

  // স্টাইলগুলো এখানে
  const styles = [
    `✅ ||⇨ 𝐉𝐎𝐈𝐍 𝐀𝐋𝐄𝐑𝐓 ⇦|| ✅\n\n➤ 𝐍𝐚𝐦𝐞: ${namesStr}\n➤ 𝐓𝐢𝐦𝐞:  ${time}`,

    `╔══ ✦ 𝐉𝐎𝐈𝐍 𝐀𝐋𝐄𝐑𝐓 ✦ ══╗\n║ 🙋‍♂️ 𝐍𝐚𝐦𝐞: ${namesStr}\n║ ⏰ 𝐓𝐢𝐦𝐞: ${time}\n╚═════════════════════╝`,

    `↗↗↗ 𝐉𝐎𝐈𝐍 𝐀𝐋𝐄𝐑𝐓 ↗↗↗\n\n➢ 𝐍𝐚𝐦𝐞: ${namesStr}\n➢ 𝐓𝐢𝐦𝐞: ${time}`,

    `❖ 𝐉𝐨𝐢𝐧 𝐃𝐞𝐭𝐞𝐜𝐭𝐞𝐝 ❖\n\n🔹 𝐍𝐚𝐦𝐞: ${namesStr}\n🔹 𝐓𝐢𝐦𝐞: ${time}`
  ];

  // র‍্যান্ডম স্টাইল সিলেক্ট করলাম
  const msgText = styles[Math.floor(Math.random() * styles.length)];

  // এখন ম্যানশনসহ মেসেজ বানাচ্ছি
  // আমাদেরকে টেক্সটের মধ্যে নাম গুলোকে ম্যানশন ট্যাগ দিয়ে রিপ্লেস করতে হবে
  // সহজ করার জন্য আমরা nameTexts এর প্রথম নাম থেকে শুরু করে রেপ্লেস করব

  let msgBody = msgText;

  // প্রতিটি নামের জন্য ট্যাগ রিপ্লেস
  for (const mention of mentions) {
    // নাম গুলো ঠিকমতো ম্যানশন ট্যাগে রিপ্লেস করা
    // শুধু প্রথম ম্যাচ রিপ্লেস করবো যাতে নাম গুলো সঠিক জায়গায় মেনশন হয়
    msgBody = msgBody.replace(mention.tag, `[${mention.tag}](user://${mention.id})`);
  }

  // মেসেজ অবজেক্ট (টেক্সট+ম্যানশন)
  const msg = {
    body: msgBody,
    mentions: mentions
  };

  return api.sendMessage(msg, threadID);
};
