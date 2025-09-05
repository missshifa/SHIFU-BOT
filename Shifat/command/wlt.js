module.exports = { config: { name: "wlt", version: "1.0.0", hasPermssion: 2, credits: "Kawsar", description: "Toggle whitelist settings & show status", commandCategory: "admin", usages: "whitelist [user/thread/status] [on/off/add/remove/view] [id]", cooldowns: 5 },

run: async function ({ api, event, args }) { const { threadID, senderID, messageID } = event; const type = args[0]; const action = args[1]; const targetID = args[2] || senderID;

if (!type || !["user", "thread", "status"].includes(type)) {
  return api.sendMessage("Usage: whitelist [user/thread/status] [on/off/add/remove/view]", threadID, messageID);
}

if (type === "status") {
  const userList = Array.from(global.whitelistUser);
  const threadList = Array.from(global.whitelistThread);
  return api.sendMessage(
    `⚙️ Whitelist Status:

✅ User Mode: ${global.whitelistUserToggle ? "ON" : "OFF"} 👤 Users: ${userList.length ? userList.join(", ") : "None"}

✅ Thread Mode: ${global.whitelistThreadToggle ? "ON" : "OFF"} 🧵 Threads: ${threadList.length ? threadList.join(", ") : "None"}`, threadID, messageID ); }

if (!action || !["on", "off", "add", "remove", "view"].includes(action)) {
  return api.sendMessage("Invalid action. Use on/off/add/remove/view.", threadID, messageID);
}

// ON / OFF TOGGLE
if (action === "on" || action === "off") {
  const value = action === "on";
  if (type === "user") global.whitelistUserToggle = value;
  else global.whitelistThreadToggle = value;
  return api.sendMessage(`${type} whitelist is now ${action.toUpperCase()}`, threadID, messageID);
}

// ADD / REMOVE
const set = type === "user" ? global.whitelistUser : global.whitelistThread;

if (action === "add") {
  set.add(targetID);
  return api.sendMessage(`${targetID} added to ${type} whitelist ✅`, threadID, messageID);
}

if (action === "remove") {
  set.delete(targetID);
  return api.sendMessage(`${targetID} removed from ${type} whitelist ❌`, threadID, messageID);
}

if (action === "view") {
  const list = Array.from(set);
  return api.sendMessage(
    `${type === "user" ? "👤 User" : "🧵 Thread"} Whitelist:

${list.length ? list.join("\n") : "None"}`, threadID, messageID ); } } };

