const fs = require("fs");
const path = require("path");
const freezePath = path.join(__dirname, "..", "..", "freeze.lock");

module.exports = function ({ api, models, Users, Threads, Currencies }) {
  const stringSimilarity = require('string-similarity'),
        escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        logger = require("../../utils/log.js");
  const axios = require('axios');
  const moment = require("moment-timezone");

  return async function ({ event }) {
    const dateNow = Date.now();
    const time = moment.tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY");
    const { allowInbox, PREFIX, ADMINBOT, NDH, DeveloperMode, adminOnly, keyAdminOnly, ndhOnly, adminPaOnly } = global.config;
    const { threadInfo, threadData, commandBanned } = global.data;
    const { commands, cooldowns } = global.client;
    var { body = "", senderID, threadID, messageID } = event;
    senderID = String(senderID);
    threadID = String(threadID);
    if ((allowInbox == false && senderID == threadID)) return;
    const threadSetting = threadData.get(threadID) || {};

    const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : PREFIX)})\\s*`);

    // 🧊 Freeze চেক: যদি freeze.lock থাকে, শুধু freeze কমান্ড চালু থাকবে
    const commandNameTest = body.trim().split(/\s+/)[0]?.toLowerCase();
    if (fs.existsSync(freezePath) && commandNameTest !== "unfreeze") return;

    // prefix ছাড়া কমান্ড চেক
    if (!prefixRegex.test(body)) {
      var commandNameNoPrefix = body.split(' ')[0].toLowerCase();
      var commandNoPrefix = commands.get(commandNameNoPrefix);
      if (!commandNoPrefix || commandNoPrefix.config.prefix !== false) return;
    }

    let commandName, args;
    if (prefixRegex.test(body)) {
      const [matchedPrefix] = body.match(prefixRegex);
      args = body.slice(matchedPrefix.length).trim().split(/ +/);
      commandName = args.shift().toLowerCase();
    } else {
      args = body.trim().split(/ +/);
      commandName = args.shift().toLowerCase();
    }

    var command = commands.get(commandName);

    if (!command) {
      var allCommandName = [];
      const commandValues = commands.keys();
      for (const cmd of commandValues) allCommandName.push(cmd);
      const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
      if (checker.bestMatch.rating >= 1) command = commands.get(checker.bestMatch.target);
      else return api.sendMessage(global.getText("handleCommand", "commandNotExist", checker.bestMatch.target), threadID);
    }

    // Permission check
    var permssion = 0;
    var threadInfoo = (threadInfo.get(threadID) || await Threads.getInfo(threadID));
    const find = threadInfoo.adminIDs.find(el => el.id == senderID);
    if (NDH.includes(senderID.toString())) permssion = 2;
    if (ADMINBOT.includes(senderID.toString())) permssion = 3;
    else if (!ADMINBOT.includes(senderID) && !NDH.includes(senderID) && find) permssion = 1;
    if (command.config.hasPermssion > permssion) return api.sendMessage(global.getText("handleCommand", "permssionNotEnough", command.config.name), threadID, messageID);

    // Cooldown check
    if (!cooldowns.has(command.config.name)) cooldowns.set(command.config.name, new Map());
    const timestamps = cooldowns.get(command.config.name);
    const expirationTime = (command.config.cooldowns || 1) * 1000;
    if (timestamps.has(senderID) && dateNow < timestamps.get(senderID) + expirationTime)
      return api.sendMessage(`You just used this command.\nTry again in ${(timestamps.get(senderID) + expirationTime - dateNow) / 1000}s.`, threadID, messageID);

    try {
      const Obj = {
        api,
        event,
        args,
        models,
        Users,
        Threads,
        Currencies,
        permssion,
        getText: command.languages && typeof command.languages == 'object' && command.languages.hasOwnProperty(global.config.language) ? (...values) => {
          var lang = command.languages[global.config.language][values[0]] || '';
          for (var i = values.length; i > 0; i--) {
            const expReg = RegExp('%' + i, 'g');
            lang = lang.replace(expReg, values[i]);
          }
          return lang;
        } : () => { },
      };
      await command.run(Obj);
      timestamps.set(senderID, dateNow);
      if (DeveloperMode)
        logger(global.getText("handleCommand", "executeCommand", time, commandName, senderID, threadID, args.join(" "), (Date.now()) - dateNow), "[ DEV MODE ]");
      return;
    } catch (e) {
      return api.sendMessage(global.getText("handleCommand", "commandError", commandName, e), threadID);
    }
  };
};
