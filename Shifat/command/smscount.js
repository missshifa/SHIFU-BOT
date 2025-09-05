module.exports.config = {
    name: "smscount",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Kawsar + GPT",
    description: "পুরাতন মেসেজ স্ক্যান করে ইউজারদের মেসেজ কাউন্ট দেখাবে",
    commandCategory: "Admin",
    cooldowns: 10,
};

module.exports.run = async function({ api, event, Users }) {
    const threadID = event.threadID;
    const fs = require('fs');
    const path = __dirname + '/count-by-thread/';
    const filePath = path + threadID + '.json';

    if (!fs.existsSync(path)) fs.mkdirSync(path);

    const msgData = {};
    let count = 0;
    let lastMessageID = null;

    api.sendMessage("📤 স্ক্যানিং শুরু হচ্ছে, অপেক্ষা করুন...", threadID);

    // স্ক্যান লুপ
    while (true) {
        const messages = await api.getThreadHistory(threadID, 100, lastMessageID);
        if (messages.length === 0) break;

        for (let msg of messages) {
            if (!msg.senderID) continue;
            msgData[msg.senderID] = (msgData[msg.senderID] || 0) + 1;
            count++;
        }

        lastMessageID = messages[messages.length - 1].messageID;

        // স্ক্যান সীমিত রাখা
        if (count > 3000) break;
    }

    // Save file
    fs.writeFileSync(filePath, JSON.stringify(msgData, null, 4));

    // Prepare message
    let sorted = Object.entries(msgData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    let rankMsg = `✅ টপ মেসেজ সেন্ডার (পেছন থেকে স্ক্যান করা)\n`;
    let i = 1;
    for (let [uid, count] of sorted) {
        let name = await Users.getNameUser(uid);
        rankMsg += `${i++}. ${name} - ${count} বার\n`;
    }

    api.sendMessage(rankMsg, threadID);
};
