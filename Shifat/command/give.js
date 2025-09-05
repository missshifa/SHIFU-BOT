const fs = require('fs');
const path = require("path");

module.exports.config = {
  name: "give",
  version: "1.0.2",
  hasPermssion: 2,
  credits: "𝐈𝐬𝐥𝐚𝐦𝐢𝐜𝐤 𝐂𝐲𝐛𝐞𝐫",
  description: "Give file for group members + delete file by name",
  commandCategory: "Admin",
  usages: "give then reply with file_number + txt/del or give <filename> to delete",
  cooldowns: 0
};

module.exports.run = async function ({ event, api, args }) {
  if (args[0]) {
    // give <filename> ডিলেট ফিচার
    const fileToDelete = args[0].toLowerCase() + ".js";
    const filePath = path.join(__dirname, fileToDelete);
    if (!fs.existsSync(filePath)) {
      return api.sendMessage(`File "${fileToDelete}" not found.`, event.threadID, event.messageID);
    }
    try {
      fs.unlinkSync(filePath);
      return api.sendMessage(`File deleted: ${fileToDelete}`, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error deleting file:", error);
      return api.sendMessage("Error deleting file.", event.threadID, event.messageID);
    }
  }

  // give কমান্ড: ফাইল লিস্ট দেখানো
  fs.readdir(__dirname, (err, files) => {
    if (err) {
      console.error("Cannot read directory: ", err);
      return;
    }
    const jsFiles = files.filter(file => path.extname(file).toLowerCase() === ".js" && file !== "give.js");
    let msg = "The files currently in the commands folder:\n";
    jsFiles.forEach((file, i) => {
      msg += `\n${i + 1}. ${file}`;
    });
    msg += "\n\nReply with the number + txt or del (e.g., 13 txt)";
    api.sendMessage(msg, event.threadID, (error, info) => {
      if (error) return console.error(error);
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: event.senderID,
        jsFiles
      });
    }, event.messageID);
  });
};

module.exports.handleReply = async function ({ event, api, handleReply }) {
  const input = event.body.split(" ");
  const num = parseInt(input[0]);
  const action = input[1];
  if (isNaN(num) || !action) {
    return api.sendMessage("Invalid input. Please enter: file_number + action (txt/del)", event.threadID, event.messageID);
  }
  const { author, jsFiles } = handleReply;
  if (event.senderID !== author) {
    return api.sendMessage("Unauthorized action.", event.threadID, event.messageID);
  }
  if (num < 1 || num > jsFiles.length) {
    return api.sendMessage("Invalid file number.", event.threadID, event.messageID);
  }
  const fileName = jsFiles[num - 1];
  const filePath = path.join(__dirname, fileName);

  try {
    if (action === "del") {
      fs.unlinkSync(filePath);
      return api.sendMessage(`File deleted: ${fileName}`, event.threadID, event.messageID);
    } else if (action === "txt") {
      const txtFile = filePath.replace('.js', '.txt');
      fs.copyFileSync(filePath, txtFile);
      return api.sendMessage({
        body: `Here is the file ${fileName} in .txt format.`,
        attachment: fs.createReadStream(txtFile)
      }, event.threadID, () => fs.unlinkSync(txtFile), event.messageID);
    } else {
      return api.sendMessage('Invalid action! Use "txt" or "del".', event.threadID, event.messageID);
    }
  } catch (error) {
    console.error("Error handling file: ", error);
    return api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
  }
};
