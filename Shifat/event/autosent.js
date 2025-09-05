const moment = require("moment-timezone");

module.exports.config = {
  name: "autosend",
  eventType: [],
  version: "1.0.0",
  credits: "Priyansh + Modified by ChatGPT",
  description: "Send different bold messages every hour (Dhaka time)"
};

module.exports.run = async ({ api }) => {
  // ঘণ্টা অনুযায়ী বোল্ড মেসেজগুলো
  const messages = {
    0: "𝗚𝗼𝗼𝗱 𝗺𝗶𝗱𝗻𝗶𝗴𝗵𝘁! 𝗧𝗶𝗺𝗲 𝘁𝗼 𝗿𝗲𝘀𝘁.",
    1: "𝗚𝗼𝗼𝗱 𝟭𝗔𝗠! 𝗞𝗲𝗲𝗽 𝗰𝗮𝗹𝗺 𝗮𝗻𝗱 𝗰𝗵𝗶𝗹𝗹.",
    2: "𝗜𝘁'𝘀 𝟮𝗔𝗠! 𝗠𝗼𝗻𝗸𝗲𝘆 𝘁𝗶𝗺𝗲!",
    3: "𝗟𝗮𝘁𝗲 𝗻𝗶𝗴𝗵𝘁 𝗳𝗹𝗼𝘄𝗲𝗿𝘀 𝗯𝗹𝗼𝗼𝗺 𝗮𝘁 𝟯𝗔𝗠.",
    4: "𝗪𝗮𝗸𝗲 𝘂𝗽 𝗮𝘁 𝟰𝗔𝗠 𝗮𝗻𝗱 𝗴𝗲𝘁 𝗵𝗮𝗿𝗱!",
    5: "𝗧𝗶𝗺𝗲 𝘁𝗼 𝗺𝗮𝗸𝗲 𝘁𝗵𝗶𝗻𝗴𝘀 𝗵𝗮𝗽𝗽𝗲𝗻! 𝟱𝗔𝗠.",
    6: "𝗚𝗼𝗼𝗱 𝗺𝗼𝗿𝗻𝗶𝗻𝗴 𝟲𝗔𝗠! 𝗙𝗲𝗲𝗹 𝘁𝗵𝗲 𝗽𝗼𝘄𝗲𝗿.",
    7: "𝗥𝗶𝘀𝗲 𝗮𝗻𝗱 𝗴𝗿𝗶𝗻𝗱 𝗮𝘁 7𝗔𝗠!",
    8: "𝗕𝗿𝗲𝗮𝗸𝗳𝗮𝘀𝘁 𝘁𝗶𝗺𝗲 𝟴𝗔𝗠! 𝗘𝗮𝘁 𝘄𝗲𝗹𝗹.",
    9: "𝗚𝗼 𝗼𝘂𝘁 𝗮𝗻𝗱 𝗴𝗿𝗶𝗻𝗱 𝗮𝘁 9𝗔𝗠!",
    10: "𝗧𝗶𝗺𝗲 𝘁𝗼 𝗳𝗼𝗰𝘂𝘀 𝗮𝘁 𝟭𝟬𝗔𝗠.",
    11: "𝗟𝘂𝗻𝗰𝗵 𝘁𝗶𝗺𝗲 𝗮𝘁 𝟭𝟭𝗔𝗠! 𝗧𝗮𝗸𝗲 𝗮 𝗯𝗿𝗲𝗮𝗸.",
    12: "𝗚𝗼𝗼𝗱 𝗮𝗳𝘁𝗲𝗿𝗻𝗼𝗼𝗻! 𝗜𝘁'𝘀 𝟭𝟮𝗣𝗠.",
    13: "𝗞𝗲𝗲𝗽 𝗴𝗼𝗶𝗻𝗴 𝗮𝘁 𝟭𝟯𝗣𝗠!",
    14: "𝗖𝗼𝗳𝗳𝗲𝗲 𝗯𝗿𝗲𝗮𝗸 𝘁𝗶𝗺𝗲 𝟭𝟰𝗣𝗠.",
    15: "𝗬𝗼𝘂'𝗿𝗲 𝗱𝗼𝗶𝗻𝗴 𝗴𝗿𝗲𝗮𝘁 𝗮𝘁 𝟭𝟱𝗣𝗠!",
    16: "𝗧𝗶𝗺𝗲 𝘁𝗼 𝘄𝗿𝗮𝗽 𝘂𝗽 𝗮𝘁 𝟭𝟲𝗣𝗠.",
    17: "𝗚𝗼𝗼𝗱 𝗲𝘃𝗲𝗻𝗶𝗻𝗴 𝗮𝘁 𝟭𝟳𝗣𝗠!",
    18: "𝗪𝗶𝗻𝗱 𝗱𝗼𝘄𝗻 𝗮𝘁 𝟭𝟴𝗣𝗠.",
    19: "𝗥𝗲𝗹𝗮𝘅 𝗮𝗻𝗱 𝗰𝗵𝗶𝗹𝗹 𝗮𝘁 𝟭𝟵𝗣𝗠.",
    20: "𝗧𝗶𝗺𝗲 𝗳𝗼𝗿 𝗱𝗶𝗻𝗻𝗲𝗿 𝟮𝟬𝗣𝗠.",
    21: "𝗚𝗼𝗼𝗱 𝗻𝗶𝗴𝗵𝘁 𝗮𝘁 𝟮𝟭𝗣𝗠!",
    22: "𝗧𝗶𝗺𝗲 𝘁𝗼 𝗰𝗵𝗶𝗹𝗹 𝗮𝘁 𝟮𝟮𝗣𝗠.",
    23: "𝗟𝗮𝘁𝗲 𝗻𝗶𝗴𝗵𝘁 𝘁𝗵𝗼𝘂𝗴𝗵𝘁𝘀 𝗮𝘁 𝟮𝟯𝗣𝗠."
  };

  let sentHour = null;

  setInterval(async () => {
    const now = moment.tz('Asia/Dhaka');
    const hour = now.hour();
    const minute = now.minute();
    const second = now.second();

    if (minute === 0 && second === 0 && sentHour !== hour) {
      if ((hour >= 0 && hour <= 11) || (hour >= 12 && hour <= 23)) {
        const allThread = global.data.allThreadID || [];
        const failed = [];

        const messageToSend = messages[hour] || `𝗛𝗲𝗹𝗹𝗼! 𝗧𝗶𝗺𝗲: ${hour}:00`;

        for (const threadID of allThread) {
          if (!isNaN(threadID)) {
            api.sendMessage(messageToSend, threadID, (err) => {
              if (err) failed.push(threadID);
            });
          }
        }

        for (const admin of global.config.ADMINBOT || []) {
          api.sendMessage(`✅ Hourly message sent at ${hour}:00\n❌ Failed threads:\n${failed.join("\n")}`, admin);
        }

        sentHour = hour;
      }
    }
  }, 1000);
};
