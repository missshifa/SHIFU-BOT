module.exports.config = {
    name: "u",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "md kawsar",
    description: "bot sms unsend",
    commandCategory: "system",
    usages: "unsend",
    cooldowns: 0,
    prefix: false
};

module.exports.run = function({ api, event }) {
    if (event.type != "message_reply") return;
    if (event.messageReply.senderID != api.getCurrentUserID()) return;
    
    return api.unsendMessage(event.messageReply.messageID);
};
