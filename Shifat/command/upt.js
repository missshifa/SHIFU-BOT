module.exports.config = {
  name: "upt",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kawsar Modified",
  description: "Show uptime or add to Uptime Robot",
  commandCategory: "monitor",
  usages: "[upt] or [upt <link>]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  let time = process.uptime();
  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time % 3600) / 60);
  let seconds = Math.floor(time % 60);
  const formatTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // যদি কোনো লিংক না দেয়, শুধু টাইম দেখাও
  if (args.length === 0) {
    return api.sendMessage(formatTime, event.threadID, event.messageID);
  }

  // যদি লিংক দেয়, তাহলে Uptime Robot-এ পাঠাও
  const url = args.join(" ");
  const regex = /(http(s)?:\/\/)[^\s]+/g;
  if (!url.match(regex)) {
    return api.sendMessage("❌ দয়া করে একটা সঠিক লিংক দাও।", event.threadID, event.messageID);
  }

  const request = require("request");
  const options = {
    method: 'POST',
    url: 'https://api.uptimerobot.com/v2/newMonitor',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
      api_key: 'u2008156-9837ddae6b3c429bd0315101',
      format: 'json',
      type: '1',
      url: url,
      friendly_name: Date.now()
    }
  };

  request(options, function (error, response, body) {
    if (error) return api.sendMessage("😢 লিংক পাঠাতে সমস্যা হয়েছে!", event.threadID, event.messageID);

    const result = JSON.parse(body);
    if (result.stat === "fail") {
      return api.sendMessage("❗এই লিংকটা আগেই add করা আছে বা ভুল!", event.threadID, event.messageID);
    }

    return api.sendMessage(`✅ লিংক add করা হয়েছে:\n${url}`, event.threadID, event.messageID);
  });
}
